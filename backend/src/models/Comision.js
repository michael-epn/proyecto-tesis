import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const comisionSchema = new Schema({
    nombre: { type: String, required: true, trim: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: 'El nombre no puede contener números'
        }
    },
    apellido: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        unique: true 
    },
    password: { type: String, required: true },
    status: { type: Boolean, default: true },
    token: { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    rol: { type: String, default: "comision" }
}, { timestamps: true })

comisionSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

comisionSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

comisionSchema.methods.createToken = function() {
    const tokenGenerado = Math.random().toString(36).slice(2)
    this.token = tokenGenerado
    return tokenGenerado
}

export default model('Direccion', direccionSchema)