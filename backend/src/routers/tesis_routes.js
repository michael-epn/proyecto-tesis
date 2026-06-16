import { Router } from 'express';
import { generarTema, enviarSolicitud, responderSolicitud } from '../controllers/solicitud_controller.js';
import { verificarTokenJWT } from '../middlewares/JWT.js';


const router = Router();

router.post('/generar', verificarTokenJWT, generarTema);
router.post('/solicitar', verificarTokenJWT, enviarSolicitud);
router.get('/historial/generaciones', verificarTokenJWT, async (req, res) => {
    const historial = await TemaGenerado.find({ estudiante: req.estudiante._id }).sort({ createdAt: -1 });
    res.json(historial);
});

router.put('/responder/:idSolicitud', verificarTokenJWT, responderSolicitud);
router.get('/historial/recibidas', verificarTokenJWT, async (req, res) => {
    const solicitudes = await SolicitudTesis.find({ docente: req.docente._id }).populate('tema estudiante');
    res.json(solicitudes);
});

export default router;