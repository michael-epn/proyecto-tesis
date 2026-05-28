import Direccion from "../models/Direccion.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"

const registro = async (req, res) => {
    const { nombre, apellido, cargo, email, password } = req.body;
    if (!nombre || !apellido || !cargo || !email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
    try {
        const existeEmail = await Direccion.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya está registrado" });
        }
        const nuevaDireccion = new Direccion(req.body);
        const token = nuevaDireccion.createToken();
        try {
            await sendMailToRegister(email, token, "direccion");
        } catch (mailError) {
            console.error("Error enviando correo:", mailError);
            return res.status(500).json({ msg: "Error al enviar el correo de confirmación" });
        }
        await nuevaDireccion.save();
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
        const direccionBDD = await Direccion.findOne({ email })
        if (!direccionBDD) {
            return res.status(404).json({ msg: "El administrador no esta registrado" })
        }
        if (!direccionBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await direccionBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        const token = crearTokenJWT(direccionBDD._id, direccionBDD.rol)
        const { nombre, apellido, cargo, _id, rol } = direccionBDD
        res.status(200).json({ token, rol, nombre, apellido, cargo, _id, email: direccionBDD.email })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.direccion._doc || req.direccion
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, cargo } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID invalido: ${id}` });
        }
        const direccionBDD = await Direccion.findById(id);
        if (!direccionBDD) {
            return res.status(404).json({ msg: "Administrador no encontrado" });
        }
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" });
        }
        direccionBDD.nombre = nombre ?? direccionBDD.nombre;
        direccionBDD.apellido = apellido ?? direccionBDD.apellido;
        direccionBDD.cargo = cargo ?? direccionBDD.cargo;
        await direccionBDD.save();
        res.status(200).json(direccionBDD);
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` });
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const direccionBDD = await Direccion.findById(req.direccion._id)
        if (!direccionBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await direccionBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        direccionBDD.password = req.body.passwordnuevo
        await direccionBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Direccion.findOne({ token });
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
        const direccionBDD = await Direccion.findOne({ email })
        if (!direccionBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        }
        const token = direccionBDD.createToken()
        await sendMailToRecoveryPassword(email, token, "direccion")
        await direccionBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electronico para restablecer tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const comprobarTokenPasword = async (req, res) => {
    try {
        const { token } = req.params
        const direccionBDD = await Direccion.findOne({ token })
        if (!direccionBDD || direccionBDD.token !== token) {
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
        const direccionBDD = await Direccion.findOne({ token })
        if (!direccionBDD) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        direccionBDD.token = null
        direccionBDD.password = password 
        await direccionBDD.save()
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