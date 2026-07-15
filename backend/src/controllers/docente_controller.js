import Docente from "../models/Docente.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js"
import { StreamChat } from "stream-chat"
import { normalizeEmail, resolveRoleFromAllowlist } from "../helpers/authRoleResolver.js"
import User from "../models/User.js"

const registro = async (req, res) => {
    try {
        const { email, password, nombre, apellido } = req.body
        if (!email || !password || !nombre || !apellido) {
            return res.status(400).json({ msg: "Debes llenar todos los campos obligatorios" })
        }
        const normalizedEmail = normalizeEmail(email);
        const { role: resolvedRole } = await resolveRoleFromAllowlist(normalizedEmail);
        if (resolvedRole !== 'docente') {
            return res.status(403).json({ 
                msg: 'Tu correo no está autorizado en la base de datos de Docentes. Si eres docente, contacta a administración.' 
            });
        }
        const existeEmail = await Docente.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya esta registrado" })
        }
        const nuevoDocente = new Docente({
            ...req.body,
            email: normalizedEmail
        });
        const token = nuevoDocente.createToken()
        await sendMailToRegister(normalizedEmail, token, "docente");
        await nuevoDocente.save()
        await User.create({
            email: normalizedEmail,
            role: 'docente',
            provider: 'local',
            status: false
        });
        try {
            const serverClient = StreamChat.getInstance(
                process.env.STREAM_API_KEY, 
                process.env.STREAM_API_SECRET
            );
            
            await serverClient.upsertUser({
                id: nuevoDocente._id.toString(),
                name: `${nuevoDocente.nombre} ${nuevoDocente.apellido}`.trim(),
                rol: "docente"
            });
        } catch (streamError) {
            console.error("Error al sincronizar con Stream Chat:", streamError);
        }
        res.status(200).json({ msg: "Revisa tu correo para confirmar tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const docenteBDD = await Docente.findOne({ email })
        if (!docenteBDD) {
            return res.status(404).json({ msg: "El docente no esta registrado" })
        }
        if (!docenteBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await docenteBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        try {
            const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            await serverClient.upsertUser({
                id: docenteBDD._id.toString(),
                name: `${docenteBDD.nombre} ${docenteBDD.apellido}`.trim(),
                image: docenteBDD.fotoPerfil || undefined,
                rol: "docente"
            });
        } catch (e) {
            console.log("Stream sync warning en login:", e.message);
        }
        const token = crearTokenJWT(docenteBDD._id, docenteBDD.rol)
        const { nombre, apellido, areas_investigacion, tecnologias_especialidad, cupos_maximos, _id, rol, cedula, celular } = docenteBDD
        res.status(200).json({ token, rol, nombre, apellido, areas_investigacion, tecnologias_especialidad, cupos_maximos, _id, email: docenteBDD.email, cedula, celular })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.docente._doc || req.docente
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, areas_investigacion, tecnologias_especialidad, cupos_maximos, disponibilidad, celular, cedula } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `ID inválido: ${id}` });
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" });
        const docenteBDD = await Docente.findById(id);
        if (!docenteBDD) return res.status(404).json({ msg: "Docente no encontrado" });
        if (req.docente && req.docente._id.toString() !== id) return res.status(403).json({ msg: "No tienes permiso para actualizar este perfil" });
        if (cedula && cedula !== docenteBDD.cedula) {
            const response = await fetch(`https://api.ecuadorapi.com/api/v1/cedulas/${cedula}`, {
                headers: { Authorization: `Bearer ${process.env.API_KEY_ECUADOR}` }
            });
            if (!response.ok) return res.status(404).json({ msg: "Cédula no válida o no encontrada" });
            docenteBDD.cedula = cedula;
        }
        if (req.files?.fotoPerfil) {
            const { secure_url } = await subirImagenCloudinary(req.files.fotoPerfil.tempFilePath, "ESFOT/Perfiles_Docentes");
            docenteBDD.fotoPerfil = secure_url;
        }
        if (req.files?.bannerPerfil) {
            const { secure_url } = await subirImagenCloudinary(req.files.bannerPerfil.tempFilePath, "ESFOT/Banners_Docentes");
            docenteBDD.bannerPerfil = secure_url;
        }
        if (cupos_maximos !== undefined && cupos_maximos < docenteBDD.cupos_ocupados) {
            return res.status(400).json({ 
                msg: `No puedes reducir tus cupos máximos a ${cupos_maximos} porque ya tienes ${docenteBDD.cupos_ocupados} estudiantes asignados o en proceso.` 
            });
        }
        const camposActualizar = {
            ...(nombre && { nombre }),
            ...(apellido && { apellido }),
            ...(celular && { celular }),
            ...(cupos_maximos !== undefined && { cupos_maximos }),
            ...(disponibilidad !== undefined && { disponibilidad: disponibilidad === 'true' || disponibilidad === true }),
            ...(areas_investigacion && { areas_investigacion: typeof areas_investigacion === 'string' ? JSON.parse(areas_investigacion) : areas_investigacion }),
            ...(tecnologias_especialidad && { tecnologias_especialidad: typeof tecnologias_especialidad === 'string' ? JSON.parse(tecnologias_especialidad) : tecnologias_especialidad })
        };
        Object.assign(docenteBDD, camposActualizar);
        await docenteBDD.save();
        try {
            const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            await serverClient.upsertUser({
                id: docenteBDD._id.toString(),
                name: `${docenteBDD.nombre} ${docenteBDD.apellido}`.trim(),
                image: docenteBDD.fotoPerfil || undefined,
                rol: docenteBDD.rol || "docente" 
            });
        } catch (e) {
            console.log("Stream sync warning en actualizar perfil docente:", e.message);
        }
        const docenteActualizado = await Docente.findById(id).select("-password -token -confirmEmail -createdAt -updatedAt -__v");
        res.status(200).json({ msg: "Perfil actualizado correctamente", docente: docenteActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` });
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const docenteBDD = await Docente.findById(req.docente._id)
        if (!docenteBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await docenteBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        docenteBDD.password = req.body.passwordnuevo
        await docenteBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const docenteBDD = await Docente.findOne({ token }); 
        if (!docenteBDD) {
            return res.status(404).json({ msg: "Token invalido o cuenta ya confirmada" });
        }
        
        docenteBDD.token = null;
        docenteBDD.confirmEmail = true;
        await docenteBDD.save();
        
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesion" });
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` });
    }
}

const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ msg: "Debes ingresar un correo electronico" })
        }
        const docenteBDD = await Docente.findOne({ email })
        if (!docenteBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        }
        const token = docenteBDD.createToken()
        await sendMailToRecoveryPassword(email, token, "docente")
        await docenteBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electronico para restablecer tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const comprobarTokenPasword = async (req, res) => {
    try {
        const { token } = req.params
        const docenteBDD = await Docente.findOne({ token })
        if (!docenteBDD || docenteBDD.token !== token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" })
        }
        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nuevo password" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const crearNuevoPassword = async (req, res) => {
    try {
        const { password, confirmpassword } = req.body
        const { token } = req.params
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Los passwords no coinciden" })
        }
        const docenteBDD = await Docente.findOne({ token })
        if (!docenteBDD) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        docenteBDD.token = null
        docenteBDD.password = password 
        await docenteBDD.save()
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const obtenerDocentes = async (req, res) => {
    try {
        const docentes = await Docente.find({ 
            confirmEmail: true, 
            status: true
        }).select('_id nombre apellido email cupos_maximos cupos_ocupados disponibilidad'); 
        
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ msg: `Error al obtener docentes - ${error.message}` });
    }
}

export {
    registro,
    login,
    perfil,
    actualizarPerfil,
    actualizarPassword,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    obtenerDocentes
}