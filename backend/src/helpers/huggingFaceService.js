import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const generarPropuestaTesis = async (promptData, historialTemas = []) => {
    const temasPrevios = historialTemas.map(t => `- ${t.titulo}`).join('\n');
    
    const systemPrompt = `Eres un sistema experto en recomendar temas de tesis. 
    REGLA ABSOLUTA: Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
    {"titulo": "...", "descripcion": "...", "tecnologias": ["...", "..."]}
    Cero texto adicional, cero saludos, cero formato markdown.`;
    
    const userPrompt = `
    Habilidades: ${promptData.habilidades.join(', ')}.
    Intereses: ${promptData.intereses.join(', ')}.
    Contexto: ${promptData.contexto}.
    Ideas base: ${promptData.ideas}.
    
    Temas a evitar (ya generados):
    ${temasPrevios || 'Ninguno.'}
    `;

    try {
        const response = await hf.chatCompletion({
            model: 'Qwen/Qwen2.5-7B-Instruct',
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 300,
            temperature: 0.6
        });

        let textoGenerado = response.choices[0].message.content.trim();
        
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
        console.error("=== ERROR FATAL HUGGING FACE ===");
        console.error("Mensaje:", error.message);
        return null;
    }
};