import { createRequire } from 'module';
import dotenv from 'dotenv';

// IDEA CLAVE: "Engañamos" a Node.js creando un require compatible con ES6
const require = createRequire(import.meta.url);
const brevo = require('@getbrevo/brevo');

dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

const sendMail = async (to, subject, html) => {
    try {
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html;
        sendSmtpEmail.sender = {
            name: "Sistema Tesis IA - ESFOT",
            email: process.env.BREVO_SENDER_EMAIL
        };
        sendSmtpEmail.to = [{ email: to }];

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Correo enviado correctamente", response.messageId);
        
        return response;
    } catch (error) {
        console.log("ERROR BREVO", error);
        throw new Error("No se pudo enviar el correo");
    }
}

export default sendMail;