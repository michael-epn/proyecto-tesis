import jwt from "jsonwebtoken"
import Estudiante from "../models/Estudiante.js"
import Docente from "../models/Docente.js"
import Direccion from "../models/Comision.js"

const crearTokenJWT = (id, rol) => {
    return jwt.sign(
        { id, rol },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    }

    try {
        const token = authorization.split(" ")[1]
        const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)

        let usuarioBDD

        if (rol === "estudiante") {
            usuarioBDD = await Estudiante.findById(id).lean().select("-password")
            if (!usuarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.estudiante = usuarioBDD
            
        } else if (rol === "docente") {
            usuarioBDD = await Docente.findById(id).lean().select("-password")
            if (!usuarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.docente = usuarioBDD
            
        } else if (rol === "direccion") {
            usuarioBDD = await Direccion.findById(id).lean().select("-password")
            if (!usuarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.direccion = usuarioBDD
            
        } else {
            return res.status(403).json({ msg: "Rol de usuario no valido" })
        }

        next()
    } catch (error) {
        return res.status(401).json({ msg: `Token invalido o expirado - ${error.message}` })
    }
}

export {
    crearTokenJWT,
    verificarTokenJWT
}