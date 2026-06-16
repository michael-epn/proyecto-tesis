import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generarPropuestaTesis = async (promptData, historialTemas = []) => {
    const temasPrevios = historialTemas.map(t => `- ${t.titulo}`).join('\n');
    
    const prompt = `
    Eres un sistema experto en recomendar temas de tesis. Genera un título y una descripción corta para un proyecto de tesis.
    
    Habilidades del estudiante: ${promptData.habilidades.join(', ')}.
    Intereses: ${promptData.intereses.join(', ')}.
    Contexto: ${promptData.contexto}.
    Ideas base: ${promptData.ideas}.
    
    REGLA 1: No repitas ni uses variaciones simples de estos temas anteriores:
    ${temasPrevios || 'Ninguno.'}
    
    REGLA 2: Devuelve ÚNICAMENTE un objeto JSON válido. No incluyas saludos, ni explicaciones, ni formato markdown.
    El JSON debe tener exactamente esta estructura:
    {"titulo": "...", "descripcion": "...", "tecnologias": ["...", "..."]}
    `;

    try {
        const response = await hf.textGeneration({
            model: 'Qwen/Qwen2.5-7B-Instruct',
            inputs: prompt,
            parameters: { 
                max_new_tokens: 300, 
                temperature: 0.6,
                return_full_text: false
            }
        });

        let textoGenerado = response.generated_text.trim();
        
        // TIP: Imprimir la respuesta exacta de la IA antes de intentar parsearla
        console.log("=== RESPUESTA CRUDA DE IA ===");
        console.log(textoGenerado);

        if (textoGenerado.startsWith('```json')) {
            textoGenerado = textoGenerado.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const jsonMatch = textoGenerado.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            console.error("Error: La IA no devolvió un JSON válido.");
            return null;
        }

        return JSON.parse(jsonMatch[0]);

    } catch (error) {
        // Captura del error exacto de la librería o de red
        console.error("=== ERROR FATAL HUGGING FACE ===");
        console.error("Mensaje:", error.message);
        console.error("Detalles:", error);
        return null;
    }
};