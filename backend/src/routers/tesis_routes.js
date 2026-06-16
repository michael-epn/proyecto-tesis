import { Router } from 'express';
import { generarTema, enviarSolicitud, responderSolicitud } from '../controllers/solicitud_controller.js';
import { verificarJWT } from '../middlewares/JWT.js'; // Asumiendo existencia

const router = Router();

router.post('/generar', verificarJWT, generarTema);
router.post('/solicitar', verificarJWT, enviarSolicitud);
router.get('/historial/generaciones', verificarJWT, async (req, res) => {
    const historial = await TemaGenerado.find({ estudiante: req.estudiante._id }).sort({ createdAt: -1 });
    res.json(historial);
});

router.put('/responder/:idSolicitud', verificarJWT, responderSolicitud);
router.get('/historial/recibidas', verificarJWT, async (req, res) => {
    const solicitudes = await SolicitudTesis.find({ docente: req.docente._id }).populate('tema estudiante');
    res.json(solicitudes);
});

export default router;