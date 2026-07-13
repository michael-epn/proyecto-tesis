import Comision from "../models/Comision.js"
import { sendMailToRegister, sendMailToRecoveryPassword, sendMailResolucionComision, sendMailResolucionComisionDocente } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import Docente from "../models/Docente.js"
import SolicitudTesis from "../models/SolicitudTesis.js"
import { StreamChat } from "stream-chat"

const registro = async (req, res) => {
    const { nombre, apellido, cargo, email, password } = req.body;
    if (!nombre || !apellido || !cargo || !email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    try {
        const existeEmail = await Comision.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }
        const nuevaComision = new Comision(req.body);
        const token = nuevaComision.createToken();
        try {
            await sendMailToRegister(email, token, "comision");
        } catch (mailError) {
            console.error("Error enviando correo:", mailError);
            return res.status(500).json({ msg: "Error al enviar el correo de confirmación" });
        }
        await nuevaComision.save();
        try {
            const serverClient = StreamChat.getInstance(
                process.env.STREAM_API_KEY, 
                process.env.STREAM_API_SECRET
            );
            
            await serverClient.upsertUser({
                id: nuevaComision._id.toString(),
                name: `${nuevaComision.nombre} ${nuevaComision.apellido}`.trim(),
                rol: "comision"
            });
        } catch (streamError) {
            console.error("Error al sincronizar con Stream Chat:", streamError);
        }
        res.status(200).json({ msg: "Revisa tu correo para confirmar tu cuenta" });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ msg: `Error en el servidor: ${error.message}` });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const comisionBDD = await Comision.findOne({ email })
        if (!comisionBDD) {
            return res.status(404).json({ msg: "La comision no esta registrada" })
        }
        if (!comisionBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await comisionBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        try {
            const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            await serverClient.upsertUser({
                id: comisionBDD._id.toString(),
                name: `${comisionBDD.nombre} ${comisionBDD.apellido}`.trim(),
                image: comisionBDD.fotoPerfil || undefined,
                rol: "comision"
            });
        } catch (e) {
            console.log("Stream sync warning en login:", e.message);
        }
        const token = crearTokenJWT(comisionBDD._id, comisionBDD.rol)
        const { nombre, apellido, cargo, _id, rol, cedula, celular } = comisionBDD
        res.status(200).json({ token, rol, nombre, apellido, cargo, _id, email: comisionBDD.email, cedula, celular })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.comision._doc || req.comision
    res.status(200).json(datosPerfil)
}


const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, cargo, celular, cedula } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: `ID inválido: ${id}` });
        if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Debes llenar todos los campos" });
        const comisionBDD = await Comision.findById(id);
        if (!comisionBDD) return res.status(404).json({ msg: "Comisionado no encontrado" });
        if (req.comision && req.comision._id.toString() !== id) return res.status(403).json({ msg: "No tienes permiso para actualizar este perfil" });
        if (cedula && cedula !== comisionBDD.cedula) {
            const response = await fetch(`https://api.ecuadorapi.com/api/v1/cedulas/${cedula}`, {
                headers: { Authorization: `Bearer ${process.env.API_KEY_ECUADOR}` }
            });
            if (!response.ok) return res.status(404).json({ msg: "Cédula no válida o no encontrada en el registro civil" });
            comisionBDD.cedula = cedula;
        }
        if (req.files?.fotoPerfil) {
            const { secure_url } = await subirImagenCloudinary(req.files.fotoPerfil.tempFilePath, "ESFOT/Perfiles_Comisiones");
            comisionBDD.fotoPerfil = secure_url;
        }
        if (req.files?.bannerPerfil) {
            const { secure_url } = await subirImagenCloudinary(req.files.bannerPerfil.tempFilePath, "ESFOT/Banners_Comisiones");
            comisionBDD.bannerPerfil = secure_url;
        }
        const camposActualizar = {
            ...(nombre && { nombre }),
            ...(apellido && { apellido }),
            ...(cargo && { cargo }),
            ...(celular && { celular })
        };
        Object.assign(comisionBDD, camposActualizar);
        await comisionBDD.save();
        try {
            const serverClient = StreamChat.getInstance(process.env.STREAM_API_KEY, process.env.STREAM_API_SECRET);
            await serverClient.upsertUser({
                id: comisionBDD._id.toString(),
                name: `${comisionBDD.nombre} ${comisionBDD.apellido}`.trim(),
                image: comisionBDD.fotoPerfil || undefined,
                rol: comisionBDD.rol
            });
        } catch (e) {
            console.log("Stream sync warning en actualizar perfil:", e.message);
        }
        const comisionActualizado = await Comision.findById(id).select("-password -token -confirmEmail -createdAt -updatedAt -__v");
        res.status(200).json({ msg: "Perfil actualizado correctamente", comision: comisionActualizado });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` });
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const comisionBDD = await Comision.findById(req.comision._id)
        if (!comisionBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await comisionBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        comisionBDD.password = req.body.passwordnuevo
        await comisionBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Comision.findOne({ token });
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "Token invalido o cuenta ya confirmada" });
        }
        usuarioBDD.token = null;
        usuarioBDD.confirmEmail = true;
        await usuarioBDD.save();
        
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
        const comisionBDD = await Comision.findOne({ email })
        if (!comisionBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        }
        const token = comisionBDD.createToken()
        await sendMailToRecoveryPassword(email, token, "comision")
        await comisionBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electronico para restablecer tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const comprobarTokenPasword = async (req, res) => {
    try {
        const { token } = req.params
        const comisionBDD = await Comision.findOne({ token })
        if (!comisionBDD || comisionBDD.token !== token) {
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
        const comisionBDD = await Comision.findOne({ token })
        if (!comisionBDD) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        comisionBDD.token = null
        comisionBDD.password = password 
        await comisionBDD.save()
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const obtenerMetricas = async (req, res) => {
    try {
        const estados = await SolicitudTesis.aggregate([
            { $group: { _id: "$estado", total: { $sum: 1 } } }
        ]);
        const cargaDocente = await Docente.find()
            .sort({ cupos_ocupados: -1 })
            .limit(5)
            .select('nombre apellido cupos_ocupados cupos_maximos');
        const tecnologias = await SolicitudTesis.aggregate([
            { $match: { estado: { $in: ['aprobado_final', 'en_comision', 'en_revision', 'finalizado'] } } },
            { $lookup: { from: 'temagenerados', localField: 'tema', foreignField: '_id', as: 'temaInfo' } },
            { $unwind: "$temaInfo" },
            { $unwind: "$temaInfo.tecnologias" },
            { $group: { _id: "$temaInfo.tecnologias", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 7 }
        ]);
        const docentesGlobal = await Docente.aggregate([
            {
                $group: {
                    _id: null,
                    totalOcupados: { $sum: "$cupos_ocupados" },
                    totalMaximos: { $sum: "$cupos_maximos" },
                    promedioCarga: { $avg: "$cupos_ocupados" }
                }
            }
        ]);
        const capacidadGlobal = docentesGlobal[0] || { totalOcupados: 0, totalMaximos: 0, promedioCarga: 0 };
        res.status(200).json({ 
            estados, 
            cargaDocente, 
            tecnologias,
            capacidadGlobal
        });
    } catch (error) {
        res.status(500).json({ msg: `Error obteniendo métricas: ${error.message}` });
    }
};

const obtenerTramitesPendientes = async (req, res) => {
    try {
        const tramites = await SolicitudTesis.find({ estado: { $in: ['en_comision', 'en_revision'] } })
            .populate('estudiante', 'nombre apellido email')
            .populate('docente', 'nombre apellido email')
            .populate('tema', 'titulo descripcion tecnologias promptData')
            .populate('revisor', 'nombre apellido email') 
            .sort({ updatedAt: 1 });
        
        res.status(200).json(tramites);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener trámites" });
    }
};

const tomarTramite = async (req, res) => {
    try {
        const { id } = req.params;
        const tramite = await SolicitudTesis.findById(id);

        if (!tramite) return res.status(404).json({ msg: "Trámite no encontrado" });
        if (tramite.estado !== 'en_comision') {
            return res.status(400).json({ msg: "Este trámite ya está siendo revisado por otro colega o ya fue resuelto." });
        }

        tramite.estado = 'en_revision';
        tramite.revisor = req.comision._id; 
        tramite.historial.push({ accion: 'En Revisión', detalle: `Bloqueado temporalmente para revisión.` });

        await tramite.save();
        await tramite.populate([
            { path: 'estudiante', select: 'nombre apellido email' },
            { path: 'docente', select: 'nombre apellido email' },
            { path: 'tema', select: 'titulo descripcion tecnologias promptData' }
        ]);
        res.status(200).json({ msg: "Trámite asignado a tu bandeja personal", tramite });
    } catch (error) {
        res.status(500).json({ msg: "Error al tomar el trámite" });
    }
};

const liberarTramite = async (req, res) => {
    try {
        const { id } = req.params;
        const tramite = await SolicitudTesis.findOne({ _id: id, revisor: req.comision._id });

        if (!tramite) return res.status(404).json({ msg: "Trámite no encontrado o bloqueado por otra persona." });

        tramite.estado = 'en_comision';
        tramite.revisor = null;
        tramite.historial.push({ accion: 'Liberado', detalle: 'Devuelto al Pool Global.' });

        await tramite.save();
        res.status(200).json({ msg: "Trámite liberado correctamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error al liberar el trámite" });
    }
};

const resolverTramite = async (req, res) => {
    try {
        const { id } = req.params;
        const { estadoFinal, feedback } = req.body; 
        if (!['aprobado_final', 'rechazado_comision'].includes(estadoFinal)) {
            return res.status(400).json({ msg: "Estado de resolución inválido" });
        }
        if (estadoFinal === 'rechazado_comision' && !feedback) {
            return res.status(400).json({ msg: "El feedback es obligatorio al rechazar" });
        }
        const tramite = await SolicitudTesis.findOne({ _id: id, revisor: req.comision._id })
            .populate('estudiante', 'email nombre apellido')
            .populate('docente', 'email nombre apellido'); 
        if (!tramite) return res.status(403).json({ msg: "No tienes permiso para resolver este trámite." });
        tramite.estado = estadoFinal;
        tramite.feedback = feedback || "Proyecto aprobado por la comisión. Éxitos en tu titulación.";
        tramite.historial.push({ 
            accion: estadoFinal === 'aprobado_final' ? 'Aprobación Final' : 'Rechazo de Comisión', 
            detalle: tramite.feedback 
        });
        if (estadoFinal === 'rechazado_comision') {
            await Docente.findByIdAndUpdate(tramite.docente, { $inc: { cupos_ocupados: -1 } });
        }
        await tramite.save();
        try {
            await sendMailResolucionComision(tramite.estudiante.email, estadoFinal, tramite.feedback);
            const nombreEstudiante = `${tramite.estudiante.nombre} ${tramite.estudiante.apellido}`;
            await sendMailResolucionComisionDocente(tramite.docente.email, estadoFinal, tramite.feedback, nombreEstudiante);
            
        } catch (mailError) {
            console.error("No se pudo enviar el correo de notificación:", mailError);
        }
        res.status(200).json({ msg: `Trámite marcado como ${estadoFinal.replace('_', ' ')}` });
    } catch (error) {
        res.status(500).json({ msg: "Error al resolver el trámite" });
    }
};

const obtenerHistorialComision = async (req, res) => {
    try {
        const historial = await SolicitudTesis.find({
            estado: { $in: ['aprobado_final', 'rechazado_comision', 'finalizado'] }
        })
        .populate('estudiante', 'nombre apellido email')
        .populate('docente', 'nombre apellido email')
        .populate('tema', 'titulo descripcion tecnologias')
        .populate('revisor', 'nombre apellido cargo')
        .sort({ updatedAt: -1 });
        
        res.status(200).json(historial);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el historial de la comisión" });
    }
};

const obtenerDocentesComision = async (req, res) => {
    try {
        const docentes = await Docente.find()
            .select('nombre apellido email disponibilidad cupos_ocupados cupos_maximos permiso_reinicio')
            .sort({ nombre: 1 });
        
        res.status(200).json(docentes);
    } catch (error) {
        res.status(500).json({ msg: `Error al obtener directorio de docentes: ${error.message}` });
    }
};

const togglePermisoReinicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { permiso_reinicio } = req.body;

        const docente = await Docente.findByIdAndUpdate(
            id,
            { permiso_reinicio },
            { new: true }
        ).select('-password -token');

        if (!docente) {
            return res.status(404).json({ msg: "Docente no encontrado" });
        }

        const estadoString = permiso_reinicio ? "concedido" : "revocado";
        res.status(200).json({ msg: `Permiso de reinicio ${estadoString} exitosamente`, docente });
    } catch (error) {
        res.status(500).json({ msg: `Error al actualizar permiso: ${error.message}` });
    }
};

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
    resolverTramite,
    obtenerMetricas,
    liberarTramite,
    obtenerTramitesPendientes,
    tomarTramite,
    obtenerHistorialComision,
    obtenerDocentesComision,
    togglePermisoReinicio
}