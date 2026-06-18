import { Schema, model } from 'mongoose';

const solicitudSchema = new Schema({
    estudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: true },
    tema: { type: Schema.Types.ObjectId, ref: 'TemaGenerado', required: true },
    estado: { 
        type: String, 
        enum: ['enviada', 'aceptada', 'rechazada', 'en_comision'], 
        default: 'enviada'
    },
    feedback: { type: String, default: null },
    fechaEnvio: { type: Date },
    fechaRespuesta: { type: Date }
}, { timestamps: true });

export default model('SolicitudTesis', solicitudSchema);