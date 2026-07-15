import { Schema, model } from 'mongoose'

const authorizedRoleSchema = new Schema({
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
        enum: ['docente', 'comision'],
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

export default model('AuthorizedRole', authorizedRoleSchema)
