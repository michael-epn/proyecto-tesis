import { Schema, model } from 'mongoose';

const temaGeneradoSchema = new Schema({
    estudiante: { type: Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    tecnologias: { type: [String], default: [] },
    promptData: {
        habilidades: [String],
        intereses: [String],
        contexto: String,
        ideas: String
    },
    estado: { 
        type: String, 
        enum: ['disponible', 'en_solicitud', 'descartado'], 
        default: 'disponible' 
    }
}, { timestamps: true });

export default model('TemaGenerado', temaGeneradoSchema);