import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const docenteSchema = new Schema({
    nombre: { type: String, required: true, trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'El nombre no puede contener números'
        }
    },
    apellido: { type: String, required: true, trim: true 
        , validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'El apellido no puede contener números'
        }
    },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true 
    },
    password: { type: String, required: true },
    celular: { type: String, trim: true, default: null },
    cedula: { type: String, trim: true, default: null },
    fotoPerfil: { type: String, default: null },
    bannerPerfil: { type: String, default: null },
    permiso_reinicio: { type: Boolean, default: false },
    areas_investigacion: { type: [String], default: [] },
    tecnologias_especialidad: { type: [String], default: [] },
    cupos_maximos: { type: Number, required: true, default: 5 },
    cupos_ocupados: { 
        type: Number, 
        default: 0,
        min: [0, 'Los cupos ocupados no pueden ser menores a 0']
    },
    disponibilidad: { type: Boolean, default: true },
    status: { type: Boolean, default: true },
    token: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    rol: { type: String, default: "docente" }
}, { timestamps: true })

docenteSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})


docenteSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

docenteSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Docente', docenteSchema)