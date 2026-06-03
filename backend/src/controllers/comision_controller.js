import Comision from "../models/Comision.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

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
            await sendMailToRegister(email, token, "Comision");
        } catch (mailError) {
            console.error("Error enviando correo:", mailError);
            return res.status(500).json({ msg: "Error al enviar el correo de confirmación" });
        }
        await nuevaComision.save();
        res.status(200).json({ msg: "Revisa tu correo para confirmar tu cuenta" });
    } catch (error) {
        console.error("Error detallado:", error); // Vital para debuggear
        res.status(500).json({ msg: `Error en el servidor: ${error.message}` });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const ComisionBDD = await Comision.findOne({ email })
        if (!ComisionBDD) {
            return res.status(404).json({ msg: "El administrador no esta registrado" })
        }
        if (!ComisionBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await ComisionBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        const token = crearTokenJWT(ComisionBDD._id, ComisionBDD.rol)
        const { nombre, apellido, cargo, _id, rol } = ComisionBDD
        res.status(200).json({ token, rol, nombre, apellido, cargo, _id, email: ComisionBDD.email })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.Comision._doc || req.Comision
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, cargo } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID invalido: ${id}` });
        }
        const ComisionBDD = await Comision.findById(id);
        if (!ComisionBDD) {
            return res.status(404).json({ msg: "Administrador no encontrado" });
        }
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }
        ComisionBDD.nombre = nombre ?? ComisionBDD.nombre;
        ComisionBDD.apellido = apellido ?? ComisionBDD.apellido;
        ComisionBDD.cargo = cargo ?? ComisionBDD.cargo;
        await ComisionBDD.save();
        res.status(200).json(ComisionBDD);
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` });
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const ComisionBDD = await Comision.findById(req.Comision._id)
        if (!ComisionBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await ComisionBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        ComisionBDD.password = req.body.passwordnuevo
        await ComisionBDD.save()
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
        const ComisionBDD = await Comision.findOne({ email })
        if (!ComisionBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        }
        const token = ComisionBDD.createToken()
        await sendMailToRecoveryPassword(email, token, "Comision")
        await ComisionBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electronico para restablecer tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const comprobarTokenPasword = async (req, res) => {
    try {
        const { token } = req.params
        const ComisionBDD = await Comision.findOne({ token })
        if (!ComisionBDD || ComisionBDD.token !== token) {
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
        const ComisionBDD = await Comision.findOne({ token })
        if (!ComisionBDD) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        ComisionBDD.token = null
        ComisionBDD.password = password 
        await ComisionBDD.save()
        res.status(200).json({ msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
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
    crearNuevoPassword
}