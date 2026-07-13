import Estudiante from '../models/Estudiante.js'
import Docente from '../models/Docente.js'
import Comision from '../models/Comision.js'
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
    process.env.STREAM_API_KEY, 
    process.env.STREAM_API_SECRET
);

export const obtenerContactosDisponibles = async (req, res) => {
    try {
        let userId = null;
        if (req.estudiante) userId = req.estudiante._id;
        else if (req.docente) userId = req.docente._id;
        else if (req.comision) userId = req.comision._id;
        if (!userId) {
            return res.status(401).json({ msg: "No autorizado" });
        }
        const selectFields = '_id nombre apellido rol fotoPerfil';
        const [estudiantes, docentes, comision] = await Promise.all([
            Estudiante.find({
                status: true,
                _id: { $ne: userId }
            }).select(selectFields),
            Docente.find({
                status: true,
                _id: { $ne: userId }
            }).select(selectFields),
            Comision.find({
                status: true,
                _id: { $ne: userId }
            }).select(selectFields)
        ]);
        const contactos = [
            ...estudiantes,
            ...docentes,
            ...comision
        ];
        res.status(200).json(contactos);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al cargar los usuarios" });
    }
}


export const generarTokenStream = async (req, res) => {
    try {
        let userId = null;

        if (req.estudiante) userId = req.estudiante._id;
        else if (req.docente) userId = req.docente._id;
        else if (req.comision) userId = req.comision._id;

        if (!userId) {
            return res.status(401).json({ msg: "No autorizado para usar el chat" });
        }

        const token = serverClient.createToken(userId.toString());

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error al generar el token de Stream" });
    }
}