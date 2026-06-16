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
    obtenerDocentes
} from '../controllers/docente_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.post('/registro', registro)
router.post('/login', login)
router.get('/confirmar/:token', confirmarMail)
router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPasword)
router.post('/nuevopassword/:token', crearNuevoPassword)

router.get('/', verificarTokenJWT, obtenerDocentes)
router.get('/perfil', verificarTokenJWT, perfil)
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfil)
router.put('/password', verificarTokenJWT, actualizarPassword)

export default router