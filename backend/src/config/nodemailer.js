import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
})

const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Sistema Tesis IA - ESFOT" <tu_correo@gmail.com>',
            to,
            subject,
            html,
        })
        console.log("Email enviado:", info.messageId)
    } catch (error) {
        console.error(error)
    }
}

export default sendMail