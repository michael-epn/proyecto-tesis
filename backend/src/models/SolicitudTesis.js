import { Schema, model } from 'mongoose';

const solicitudSchema = new Schema({
    estudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: true },
    tema: { type: Schema.Types.ObjectId, ref: 'TemaGenerado', required: true },
    estado: { 
        type: String, 
        enum: ['borrador', 'enviada', 'aceptada', 'rechazada'], 
        default: 'borrador' 
    },
    feedback: { type: String, default: null },
    fechaEnvio: { type: Date },
    fechaRespuesta: { type: Date }
}, { timestamps: true });

export default model('SolicitudTesis', solicitudSchema);