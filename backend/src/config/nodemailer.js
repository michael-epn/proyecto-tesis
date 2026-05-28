import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
})

transporter.verify((error, success) => {

    if (error) {

        console.log("ERROR SMTP:")
        console.log(error)

    } else {

        console.log("SMTP listo")

    }

})


const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Sistema Tesis IA - ESFOT" <${process.env.GMAIL_USER}>`,
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