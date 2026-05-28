import Estudiante from "../models/Estudiante.js"
import { sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import mongoose from "mongoose"
import { sendMailToRecoveryPassword } from "../helpers/sendMail.js"


const registro = async (req, res) => {
    try {
        const { email } = req.body
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        const existeEmail = await Estudiante.findOne({ email })
        if (existeEmail) {
            return res.status(400).json({ msg: "El email ya esta registrado" })
        }
        const nuevoEstudiante = new Estudiante(req.body)
        const token = nuevoEstudiante.createToken()
        await sendMailToRegister(email, token, "estudiante")
        await nuevoEstudiante.save()
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
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "El estudiante no esta registrado" })
        }
        if (!estudianteBDD.confirmEmail) {
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })
        }
        const verificarPassword = await estudianteBDD.matchPassword(password)
        if (!verificarPassword) {
            return res.status(401).json({ msg: "Password incorrecto" })
        }
        const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol)
        const { nombre, apellido, carrera, intereses, habilidades_tecnicas, _id, rol } = estudianteBDD
        res.status(200).json({ token, rol, nombre, apellido, carrera, intereses, habilidades_tecnicas, _id, email: estudianteBDD.email })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const perfil = (req, res) => {
    const { token, confirmEmail, createdAt, updatedAt, __v, password, ...datosPerfil } = req.estudiante._doc || req.estudiante
    res.status(200).json(datosPerfil)
}

const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, carrera, email, intereses, habilidades_tecnicas } = req.body
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: `ID invalido: ${id}` })
        }
        const estudianteBDD = await Estudiante.findById(id)
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "Estudiante no encontrado" })
        }
        if (Object.values(req.body).includes("")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (estudianteBDD.email !== email) {
            const emailExistente = await Estudiante.findOne({ email })
            if (emailExistente) {
                return res.status(400).json({ msg: "El email ya esta registrado" })
            }
        }
        estudianteBDD.nombre = nombre ?? estudianteBDD.nombre
        estudianteBDD.apellido = apellido ?? estudianteBDD.apellido
        estudianteBDD.carrera = carrera ?? estudianteBDD.carrera
        estudianteBDD.intereses = intereses ?? estudianteBDD.intereses
        estudianteBDD.habilidades_tecnicas = habilidades_tecnicas ?? estudianteBDD.habilidades_tecnicas
        estudianteBDD.email = email ?? estudianteBDD.email
        await estudianteBDD.save()
        res.status(200).json(estudianteBDD)
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const actualizarPassword = async (req, res) => {
    try {
        const estudianteBDD = await Estudiante.findById(req.estudiante._id)
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" })
        }
        const verificarPassword = await estudianteBDD.matchPassword(req.body.passwordactual)
        if (!verificarPassword) {
            return res.status(400).json({ msg: "El password actual no es correcto" })
        }
        estudianteBDD.password = req.body.passwordnuevo
        await estudianteBDD.save()
        res.status(200).json({ msg: "Password actualizado correctamente" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params;
        const usuarioBDD = await Estudiante.findOne({ token }); 

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
        const estudianteBDD = await Estudiante.findOne({ email })
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        }
        const token = estudianteBDD.createToken()
        await sendMailToRecoveryPassword(email, token, "estudiante")
        await estudianteBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electronico para restablecer tu cuenta" })
    } catch (error) {
        res.status(500).json({ msg: `Error en el servidor - ${error.message}` })
    }
}

const comprobarTokenPasword = async (req, res) => {
    try {
        const { token } = req.params
        const estudianteBDD = await Estudiante.findOne({ token })
        if (!estudianteBDD || estudianteBDD.token !== token) {
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
        const estudianteBDD = await Estudiante.findOne({ token })
        if (!estudianteBDD) {
            return res.status(404).json({ msg: "No se puede validar la cuenta" })
        }
        estudianteBDD.token = null
        estudianteBDD.password = password 
        await estudianteBDD.save()
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