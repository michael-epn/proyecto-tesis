import TemaGenerado from '../models/TemaGenerado.js';
import SolicitudTesis from '../models/SolicitudTesis.js';
import Docente from '../models/Docente.js';
import { generarPropuestaTesis } from '../helpers/huggingFaceService.js';
import { sendMailSolicitudActualizada } from '../helpers/sendMail.js';

export const generarTema = async (req, res) => {
    const { habilidades, intereses, contexto, ideas } = req.body;
    const estudianteId = req.estudiante._id;
    const solicitudAceptada = await SolicitudTesis.findOne({ 
        estudiante: estudianteId, 
        estado: { $in: ['aceptada', 'en_comision'] } 
    });
    if (solicitudAceptada) return res.status(403).json({ msg: "Ya tienes una tutoría aceptada." });
    const solicitudesActivas = await SolicitudTesis.countDocuments({
        estudiante: estudianteId,
        estado: { $nin: ['rechazada', 'rechazado_comision'] }
    });
    if (solicitudesActivas >= 2) {
        return res.status(403).json({ msg: "Límite de temas o trámites activos alcanzado." });
    }
    const historial = await TemaGenerado.find({ estudiante: estudianteId }).limit(5);
    const IA_Response = await generarPropuestaTesis(req.body, historial);
    if (!IA_Response) return res.status(500).json({ msg: "Error al generar tema con IA" });
    res.status(200).json({
        id_temporal: Date.now().toString(),
        borrador: true,
        ...IA_Response,
        promptData: req.body 
    });
};

export const enviarSolicitud = async (req, res) => {
    const { temaData, docenteId } = req.body;
    const estudianteId = req.estudiante._id;
    const docente = await Docente.findById(docenteId);
    if (!docente) return res.status(404).json({ msg: "El docente no existe." });
    if (!docente.disponibilidad || docente.cupos_ocupados >= docente.cupos_maximos) {
        return res.status(403).json({ msg: "El docente ya no tiene cupos disponibles o no está disponible." });
    }
    const solicitudesActivas = await SolicitudTesis.countDocuments({
        estudiante: estudianteId,
        estado: { $nin: ['rechazada', 'rechazado_comision'] }
    });
    if (solicitudesActivas >= 2) {
        return res.status(403).json({ msg: "Límite de temas o trámites activos alcanzado." });
    }
    const nuevoTema = await TemaGenerado.create({
        estudiante: estudianteId,
        titulo: temaData.titulo,
        descripcion: temaData.descripcion,
        tecnologias: temaData.tecnologias,
        promptData: temaData.promptData,
        estado: 'en_solicitud'
    });
    const solicitud = await SolicitudTesis.create({
        estudiante: estudianteId,
        docente: docenteId,
        tema: nuevoTema._id,
        estado: 'enviada',
        fechaEnvio: new Date()
    });

    res.status(201).json({ msg: "Solicitud enviada exitosamente", solicitud });
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

export const reiniciarCuposDocente = async (req, res) => {
    try {
        const docente = await Docente.findById(req.docente._id);
        if (!docente.permiso_reinicio) {
            return res.status(403).json({ msg: "Requiere permiso de la comisión para reiniciar cupos." });
        }
        const resultado = await SolicitudTesis.updateMany(
            { docente: req.docente._id, estado: 'aceptada' },
            { estado: 'rechazada', feedback: 'Trámites previos cancelados por reinicio.' }
        );
        docente.cupos_ocupados = 0;
        docente.permiso_reinicio = false;
        await docente.save();
        res.status(200).json({ msg: "Contador reiniciado exitosamente.", docente });
    } catch (error) {
        res.status(500).json({ msg: "Error al reiniciar cupos" });
    }
};

export const eliminarEstudianteAceptado = async (req, res) => {
    try {
        const { idSolicitud } = req.params;
        const { feedback } = req.body;
        if (!feedback) return res.status(400).json({ msg: "El feedback es obligatorio para eliminar." });
        const solicitud = await SolicitudTesis.findById(idSolicitud);
        if (!solicitud) return res.status(404).json({ msg: "Solicitud no encontrada" });
        solicitud.estado = 'rechazada';
        solicitud.feedback = feedback;
        solicitud.historial.push({ 
            accion: 'Eliminación por Docente', 
            detalle: feedback 
        });
        await solicitud.save();
        await Docente.findByIdAndUpdate(req.docente._id, { $inc: { cupos_ocupados: -1 } });
        res.status(200).json({ msg: "Estudiante removido exitosamente e historial actualizado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al remover estudiante" });
    }
};

export const enviarListaComision = async (req, res) => {
    try {
        const resultado = await SolicitudTesis.updateMany(
            { docente: req.docente._id, estado: 'aceptada' },
            { 
                $set: { estado: 'en_comision' },
                $push: { 
                    historial: { 
                        accion: 'Enviado a Comisión', 
                        detalle: 'Trámite despachado al Pool Global por el docente tutor.' 
                    } 
                }
            }
        );
        if (resultado.modifiedCount === 0) {
            return res.status(400).json({ msg: "No hay estudiantes aceptados para enviar." });
        }
        res.status(200).json({ msg: `Se han enviado ${resultado.modifiedCount} solicitudes a la Comisión exitosamente.` });
    } catch (error) {
        res.status(500).json({ msg: "Error al enviar a la comisión" });
    }
};