import { Router } from 'express';
import { generarTema, enviarSolicitud, responderSolicitud } from '../controllers/solicitud_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';
import SolicitudTesis from '../models/SolicitudTesis.js';


const router = Router();

router.post('/generar', verificarTokenJWT, generarTema);
router.post('/solicitar', verificarTokenJWT, enviarSolicitud);
router.get('/mis-solicitudes', verificarTokenJWT, async (req, res) => {
    try {
        const solicitudes = await SolicitudTesis.find({ estudiante: req.estudiante._id })
            .populate('docente', 'nombre apellido email') // Trae los datos del docente asignado
            .populate('tema', 'titulo descripcion tecnologias') // Trae los datos del tema
            .sort({ createdAt: -1 });
        res.json(solicitudes);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las solicitudes" });
    }
});

router.put('/responder/:idSolicitud', verificarTokenJWT, responderSolicitud);
router.get('/historial/recibidas', verificarTokenJWT, async (req, res) => {
    const solicitudes = await SolicitudTesis.find({ docente: req.docente._id }).populate('tema estudiante');
    res.json(solicitudes);
});
router.post('/docente/reiniciar-cupos', verificarTokenJWT, reiniciarCuposDocente);
router.delete('/docente/eliminar-aceptado/:idSolicitud', verificarTokenJWT, eliminarEstudianteAceptado);
router.post('/docente/enviar-comision', verificarTokenJWT, enviarListaComision);
export default router;