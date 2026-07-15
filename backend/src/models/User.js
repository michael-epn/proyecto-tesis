import { Schema, model } from 'mongoose'

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        required: true,
        enum: ['estudiante', 'docente', 'comision'],
        default: 'estudiante'
    },
    provider: {
        type: String,
        enum: ['google', 'local'],
        default: 'local'
    },
    lastLoginAt: {
        type: Date,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default model('User', userSchema)
