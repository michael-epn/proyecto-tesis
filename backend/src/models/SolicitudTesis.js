import { Schema, model } from 'mongoose';

const historialSchema = new Schema({
    accion: String,
    detalle: String,
    fecha: { type: Date, default: Date.now }
}, { _id: false });

const solicitudSchema = new Schema({
    estudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    docente: { type: Schema.Types.ObjectId, ref: 'Docente', required: true },
    tema: { type: Schema.Types.ObjectId, ref: 'TemaGenerado', required: true },
    revisor: { type: Schema.Types.ObjectId, ref: 'Comision', default: null },
    estado: { 
        type: String, 
        enum: ['enviada', 'aceptada', 'rechazada', 'en_comision', 'en_revision', 'aprobado_final', 'rechazado_comision', 'finalizado'], 
        default: 'enviada'
    },
    feedback: { type: String, default: null },
    fechaEnvio: { type: Date },
    fechaRespuesta: { type: Date },
    historial: [historialSchema]
}, { timestamps: true });

export default model('SolicitudTesis', solicitudSchema);