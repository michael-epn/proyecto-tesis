import { Router } from 'express'
import { generarTokenStream, obtenerContactosDisponibles } from '../controllers/chat_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'

const router = Router()

router.get('/token', verificarTokenJWT, generarTokenStream)
router.get('/usuarios-disponibles', verificarTokenJWT, obtenerContactosDisponibles)

export default router