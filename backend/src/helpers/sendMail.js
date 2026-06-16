import sendMail from "../config/brevo.js"

const sendMailToRegister = async (userMail, token, rol) => {
    return await sendMail(
        userMail,
        "Confirmacion de Cuenta - Sistema de Recomendacion de Tesis ESFOT",
        `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">
            <div style="background-color: #2f227c; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">SISTEMA PREDICTIVO ESFOT</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #1f2937;">
                <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;">Verificacion de credenciales</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Saludos cordiales,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Tu registro en el Sistema Inteligente de Recomendacion de Tesis ha sido procesado con exito. Para activar tu perfil, es indispensable confirmar tu direccion de correo electronico.</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${process.env.URL_FRONTEND}/auth/confirmar/${token}" style="background-color: #8470ff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; display: inline-block; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">Confirmar Cuenta</a>
                </div>
                <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0; border-top: 1px solid #e5e7eb; padding-top: 15px;">Si no has solicitado la creacion de esta cuenta, puedes ignorar este mensaje con total seguridad.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
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
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">
            <div style="background-color: #2f227c; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">SISTEMA PREDICTIVO ESFOT</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #1f2937;">
                <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;">Restablecimiento de Credenciales</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Saludos cordiales,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Has solicitado restablecer tu password. Haz clic en el siguiente boton para configurar tus nuevas credenciales de acceso.</p>
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${process.env.URL_FRONTEND}/auth/nuevopassword/${token}" style="background-color: #8470ff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; display: inline-block; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">Restablecer Password</a>
                </div>
                <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0; border-top: 1px solid #e5e7eb; padding-top: 15px;">Si no has solicitado este cambio, por favor ignora este mensaje. Tu cuenta se mantiene segura.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <strong>Escuela de Formacion de Tecnologos (ESFOT)</strong><br>
                Escuela Politecnica Nacional<br>
                Quito, Ecuador
            </div>
        </div>
        `
    )
}
const sendMailSolicitudActualizada = async (userMail, estado, feedback) => {
    const mensajeExtra = estado === 'rechazada' ? `<p><strong>Feedback del docente:</strong> ${feedback}</p>` : '';
    
    return await sendMail(
        userMail,
        `Actualización de Solicitud de Tesis - ${estado.toUpperCase()}`,
        `
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">
            <div style="background-color: #2f227c; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">SISTEMA PREDICTIVO ESFOT</h1>
            </div>
            <div style="padding: 30px; background-color: #ffffff; color: #1f2937;">
                <h2 style="color: #111827; margin-top: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em;">Actualización de Solicitud</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Saludos cordiales,</p>
                <p style="font-size: 16px; line-height: 1.5; color: #4b5563;">Te informamos que el estado de tu solicitud de tesis ha sido actualizado a: <strong style="color: #111827; text-transform: uppercase;">${estado}</strong>.</p>
                
                <div style="font-size: 16px; line-height: 1.5; color: #4b5563; margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #8470ff; border-radius: 4px;">
                    ${mensajeExtra}
                </div>

                <div style="text-align: center; margin: 35px 0;">
                    <a href="${process.env.URL_FRONTEND}" style="background-color: #8470ff; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; display: inline-block; box-shadow: 0 1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02);">Ver en la Plataforma</a>
                </div>
                <p style="font-size: 14px; color: #9ca3af; margin-bottom: 0; border-top: 1px solid #e5e7eb; padding-top: 15px;">Por favor, ingresa al sistema para revisar los detalles completos de esta actualización.</p>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280;">
                <strong>Escuela de Formación de Tecnólogos (ESFOT)</strong><br>
                Escuela Politécnica Nacional<br>
                Quito, Ecuador
            </div>
        </div>
        `
    );
};

export { sendMailToRegister, sendMailToRecoveryPassword, sendMailSolicitudActualizada }