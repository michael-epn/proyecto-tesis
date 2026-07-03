import { Router } from 'express'
import { 
    registro, 
    login, 
    perfil, 
    actualizarPerfil, 
    actualizarPassword,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    obtenerMetricas,
    obtenerTramitesPendientes,
    tomarTramite,
    liberarTramite,
    resolverTramite,
    obtenerHistorialComision,
    togglePermisoReinicio,
    obtenerDocentesComision
} from '../controllers/comision_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/registro', registro)
router.post('/login', login)
router.get('/confirmar/:token', confirmarMail)
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPasword)
router.post('/nuevopassword/:token', crearNuevoPassword)

router.get('/perfil', verificarTokenJWT, perfil)
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfil)
router.put('/password', verificarTokenJWT, actualizarPassword)

router.get('/metricas', verificarTokenJWT, obtenerMetricas);
router.get('/tramites-pendientes', verificarTokenJWT, obtenerTramitesPendientes);
router.put('/tramites/tomar/:id', verificarTokenJWT, tomarTramite);
router.put('/tramites/liberar/:id', verificarTokenJWT, liberarTramite);
router.put('/tramites/resolver/:id', verificarTokenJWT, resolverTramite);
router.get('/historial', verificarTokenJWT, obtenerHistorialComision);
router.get('/docentes', verificarTokenJWT, obtenerDocentesComision);
router.put('/docentes/permiso-reinicio/:id', verificarTokenJWT, togglePermisoReinicio);

export default router