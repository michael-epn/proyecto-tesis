import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const estudianteSchema = new Schema({
    nombre: { type: String, required: true, trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'El nombre no puede contener números'
        }
    },
    apellido: { type: String, required: true, trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'El apellido no puede contener números'
        }
    },
    carrera: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Formato de correo inválido']
    },
    password: { type: String, required: true },
    fotoPerfil: { type: String, default: null },
    bannerPerfil: { type: String, default: null },
    intereses: { type: [String], default: [] },
    habilidades_tecnicas: { type: [String], default: [] },
    status: { type: Boolean, default: true },
    token: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    rol: { type: String, default: "estudiante" }
}, { timestamps: true })

estudianteSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Método para verificar password en el login
estudianteSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

// Método para generar token de recuperación o confirmación
estudianteSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Estudiante', estudianteSchema)