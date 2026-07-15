import { normalizeEmail, resolveRoleFromAllowlist } from '../helpers/authRoleResolver.js'

const resolveAuthRole = async (req, res, next) => {
    try {
        const email = req.body?.email || req.query?.email

        if (!email) {
            return res.status(400).json({ msg: 'El email es requerido para resolver el rol' })
        }

        const { email: normalizedEmail, role } = await resolveRoleFromAllowlist(email)
        req.authEmail = normalizedEmail
        req.authRole = role
        next()
    } catch (error) {
        return res.status(500).json({ msg: `Error al resolver el rol - ${error.message}` })
    }
}

export { resolveAuthRole, normalizeEmail }
