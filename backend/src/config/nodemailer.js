import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()



const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
    },
})

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: 'Sistema Tesis IA - ESFOT',
            to,
            subject,
            html,
        })
        console.log("Email enviado exitosamente: " + info.messageId)
    } catch (error) {
        console.error("Error enviando email: " + error.message)
        throw new Error("No se pudo enviar el correo de confirmación");
    }
}

export default sendMail