import { Router } from 'express'
import { googleCallback } from '../controllers/auth_controller.js'
import { resolveAuthRole } from '../middlewares/resolveAuthRole.js'

const router = Router()

router.post('/google', resolveAuthRole, googleCallback)

export default router
