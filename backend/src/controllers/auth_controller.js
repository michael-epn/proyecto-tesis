import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import Estudiante from '../models/Estudiante.js'
import Docente from '../models/Docente.js'
import Comision from '../models/Comision.js'
import User from '../models/User.js'
import { crearTokenJWT } from '../middlewares/JWT.js'
import { normalizeEmail, resolveRoleFromAllowlist } from '../helpers/authRoleResolver.js'

const ROLE_MODELS = {
    estudiante: Estudiante,
    docente: Docente,
    comision: Comision
}

const buildBaseProfile = (role, email, nombre, apellido, fotoPerfil, carrera) => {
    const baseNombre = nombre || email.split('@')[0] || 'Usuario'
    const baseApellido = apellido || 'Google'
    const tempPassword = crypto.randomBytes(16).toString('hex')

    if (role === 'docente') {
        return {
            nombre: baseNombre,
            apellido: baseApellido,
            email,
            password: tempPassword,
            cupos_maximos: 5,
            fotoPerfil: fotoPerfil || null,
            confirmEmail: true,
            rol: role
        }
    }

    if (role === 'comision') {
        return {
            nombre: baseNombre,
            apellido: baseApellido,
            email,
            password: tempPassword,
            cargo: 'Miembro de comisión',
            fotoPerfil: fotoPerfil || null,
            confirmEmail: true,
            rol: role
        }
    }

    return {
        nombre: baseNombre,
        apellido: baseApellido,
        email,
        password: tempPassword,
        carrera: carrera,
        fotoPerfil: fotoPerfil || null,
        confirmEmail: true,
        rol: role
    }
}

const upsertRoleAccount = async (role, email, nombre, apellido, fotoPerfil, carrera) => {
    const Model = ROLE_MODELS[role]
    const baseProfile = buildBaseProfile(role, email, nombre, apellido, fotoPerfil, carrera)
    const hashedPassword = await bcrypt.hash(baseProfile.password, 10)

    const { 
        nombre: bNombre, 
        apellido: bApellido, 
        fotoPerfil: bFotoPerfil, 
        confirmEmail, 
        rol, 
        ...insertOnlyFields
    } = baseProfile;

    return Model.findOneAndUpdate(
        { email },
        {
            $setOnInsert: {
                ...insertOnlyFields,
                password: hashedPassword
            },
            $set: {
                nombre: bNombre,
                apellido: bApellido,
                fotoPerfil: bFotoPerfil,
                confirmEmail: confirmEmail,
                rol: rol,
                status: true
            }
        },
        {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    ).select('-password')
}

const googleCallback = async (req, res) => {
    try {
        const { email, nombre, apellido, picture, carrera, action, rolEsperado } = req.body;
        if (!email) {
            return res.status(400).json({ msg: 'El email es requerido' });
        }
        const normalizedEmail = normalizeEmail(email);
        const usuarioExistente = await User.findOne({ email: normalizedEmail });
        if (action === 'login') {
            if (!usuarioExistente) {
                return res.status(404).json({ 
                    msg: 'No tienes una cuenta registrada. Por favor, regístrate primero.' 
                });
            }
            const Model = ROLE_MODELS[usuarioExistente.role];
            const account = await Model.findOne({ email: normalizedEmail }).select('-password');
            await User.findOneAndUpdate(
                { email: normalizedEmail },
                { $set: { lastLoginAt: new Date(), status: true } }
            );
            const token = crearTokenJWT(account._id, usuarioExistente.role);
            return res.status(200).json({
                msg: 'Autenticación exitosa',
                token,
                role: usuarioExistente.role,
                usuario: account
            });
        }
        if (action === 'register') {
            if (usuarioExistente) {
                return res.status(400).json({ 
                    msg: 'Este correo ya está registrado. Por favor, inicia sesión.' 
                });
            }
            const resolvedRole = req.authRole || (await resolveRoleFromAllowlist(normalizedEmail)).role;
            if (rolEsperado === 'docente' && resolvedRole !== 'docente') {
                return res.status(403).json({ 
                    msg: 'Tu correo no está autorizado en la base de datos de Docentes. Si eres docente, contacta a administración.' 
                });
            }
            if (rolEsperado === 'comision' && resolvedRole !== 'comision') {
                return res.status(403).json({ 
                    msg: 'Tu correo no está autorizado para cuenta de Comisión Académica.' 
                });
            }
            const account = await upsertRoleAccount(resolvedRole, normalizedEmail, nombre, apellido, picture, carrera);
            await User.create({
                email: normalizedEmail,
                role: resolvedRole,
                provider: 'google',
                lastLoginAt: new Date(),
                status: true
            });
            const token = crearTokenJWT(account._id, resolvedRole);
            return res.status(201).json({
                msg: 'Cuenta creada exitosamente',
                token,
                role: resolvedRole,
                usuario: account
            });
        }

        return res.status(400).json({ msg: 'Acción no válida' });

    } catch (error) {
        return res.status(500).json({ msg: `Error en la autenticación con Google - ${error.message}` });
    }
};

export {
    googleCallback
}
