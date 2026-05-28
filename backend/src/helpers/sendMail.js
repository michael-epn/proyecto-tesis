import sendMail from "../config/brevo.js"

const sendMailToRegister = async (userMail, token, rol) => {
    return await sendMail(
        userMail,
        "Confirmacion de Cuenta - Sistema de Recomendacion de Tesis ESFOT",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #dce1e5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #003366; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">SISTEMA PREDICTIVO ESFOT</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                <h2 style="color: #003366; margin-top: 0; font-size: 20px;">Verificacion de credenciales</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #555555;">Saludos cordiales,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #555555;">Tu registro en el Sistema Inteligente de Recomendacion de Tesis ha sido procesado con exito. Para activar tu perfil, es indispensable confirmar tu direccion de correo electronico.</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href=`${process.env.URL_FRONTEND}/#/auth/nuevopassword/${token}` style="background-color: #cc0000; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">Confirmar Cuenta</a>
                </div>
                <p style="font-size: 14px; color: #888888; margin-bottom: 0; border-top: 1px solid #eeeeee; padding-top: 15px;">Si no has solicitado la creacion de esta cuenta, puedes ignorar este mensaje con total seguridad.</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777777;">
                <strong>Escuela de Formacion de Tecnologos (ESFOT)</strong><br>
                Escuela Politecnica Nacional<br>
                Quito, Ecuador
            </div>
        </div>
        `
    )
}

const sendMailToRecoveryPassword = async (userMail, token, rol) => {
    return await sendMail(
        userMail,
        "Recuperacion de Password - Sistema de Recomendacion de Tesis ESFOT",
        `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #dce1e5; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #003366; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">SISTEMA PREDICTIVO ESFOT</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #333333;">
                <h2 style="color: #003366; margin-top: 0; font-size: 20px;">Restablecimiento de Credenciales</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #555555;">Saludos cordiales,</p>
                <p style="font-size: 16px; line-height: 1.6; color: #555555;">Has solicitado restablecer tu password. Haz clic en el siguiente boton para configurar tus nuevas credenciales de acceso.</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href=`${process.env.URL_FRONTEND}/#/auth/nuevopassword/${token}` style="background-color: #003366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">Restablecer Password</a>
                </div>
                <p style="font-size: 14px; color: #888888; margin-bottom: 0; border-top: 1px solid #eeeeee; padding-top: 15px;">Si no has solicitado este cambio, por favor ignora este mensaje. Tu cuenta se mantiene segura.</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #777777;">
                <strong>Escuela de Formacion de Tecnologos (ESFOT)</strong><br>
                Escuela Politecnica Nacional<br>
                Quito, Ecuador
            </div>
        </div>
        `
    )
}

export { sendMailToRegister, sendMailToRecoveryPassword }