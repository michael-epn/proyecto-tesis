import AuthorizedRole from '../models/AuthorizedRole.js'

const ALLOWED_ROLES = ['docente', 'comision']

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const resolveRoleFromAllowlist = async (email) => {
    const normalizedEmail = normalizeEmail(email)
    const allowlistEntry = await AuthorizedRole.findOne({
        email: normalizedEmail,
        active: true
    }).lean().select('role')

    const resolvedRole = allowlistEntry?.role && ALLOWED_ROLES.includes(allowlistEntry.role)
        ? allowlistEntry.role
        : 'estudiante'

    return { email: normalizedEmail, role: resolvedRole }
}

export {
    normalizeEmail,
    resolveRoleFromAllowlist
}
