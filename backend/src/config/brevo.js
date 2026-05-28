import dotenv from 'dotenv';

dotenv.config();

const sendMail = async (to, subject, html) => {
    try {
        // IDEA CLAVE: Petición directa a la API REST de Brevo
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.BREVO_API_KEY
            },
            body: JSON.stringify({
                sender: { 
                    name: "Sistema Tesis IA - ESFOT", 
                    email: process.env.BREVO_SENDER_EMAIL 
                },
                to: [
                    { email: to }
                ],
                subject: subject,
                htmlContent: html
            })
        });

        // Validamos si la respuesta HTTP es exitosa
        if (!response.ok) {
            const errorDetails = await response.json();
            console.log("Detalles del rechazo de Brevo:", errorDetails);
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Correo enviado exitosamente vía API REST. ID:", data.messageId);
        
        return data;

    } catch (error) {
        console.log("ERROR BREVO HTTP", error);
        throw new Error("No se pudo enviar el correo de confirmación");
    }
}

export default sendMail;