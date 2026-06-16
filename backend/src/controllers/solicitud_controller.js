import TemaGenerado from '../models/TemaGenerado.js';
import SolicitudTesis from '../models/SolicitudTesis.js';
import Docente from '../models/Docente.js';
import { generarPropuestaTesis } from '../helpers/huggingFaceService.js';
import { sendMailSolicitudActualizada } from '../helpers/sendMail.js';

export const generarTema = async (req, res) => {
    const { habilidades, intereses, contexto, ideas } = req.body;
    const estudianteId = req.estudiante._id;

    const historial = await TemaGenerado.find({ estudiante: estudianteId }).limit(5);
    
    const IA_Response = await generarPropuestaTesis(req.body, historial);

    if (!IA_Response) return res.status(500).json({ msg: "Error al generar tema con IA" });

    const nuevoTema = await TemaGenerado.create({
        estudiante: estudianteId,
        titulo: IA_Response.titulo,
        descripcion: IA_Response.descripcion,
        tecnologias: IA_Response.tecnologias,
        promptData: req.body
    });

    res.status(201).json(nuevoTema);
};

export const enviarSolicitud = async (req, res) => {
    const { temaId, docenteId } = req.body;
    
    const solicitud = await SolicitudTesis.create({
        estudiante: req.estudiante._id,
        docente: docenteId,
        tema: temaId,
        estado: 'enviada',
        fechaEnvio: new Date()
    });

    await TemaGenerado.findByIdAndUpdate(temaId, { estado: 'en_solicitud' });
    
    res.status(200).json({ msg: "Solicitud enviada exitosamente", solicitud });
};

export const responderSolicitud = async (req, res) => {
    const { idSolicitud } = req.params;
    const { estado, feedback } = req.body;
    const docenteId = req.docente._id;

    if (estado === 'rechazada' && !feedback) {
        return res.status(400).json({ msg: "El feedback es obligatorio al rechazar" });
    }

    if (estado === 'aceptada') {
        const docenteActualizado = await Docente.findOneAndUpdate(
            { _id: docenteId, $expr: { $lt: ["$cupos_ocupados", "$cupos_maximos"] } },
            { $inc: { cupos_ocupados: 1 } },
            { new: true }
        );

        if (!docenteActualizado) {
            return res.status(400).json({ msg: "No tienes cupos disponibles" });
        }
    }

    const solicitud = await SolicitudTesis.findByIdAndUpdate(
        idSolicitud,
        { estado, feedback, fechaRespuesta: new Date() },
        { new: true }
    ).populate('estudiante');

    await sendMailSolicitudActualizada(solicitud.estudiante.email, estado, feedback);

    res.status(200).json({ msg: `Solicitud ${estado}`, solicitud });
};