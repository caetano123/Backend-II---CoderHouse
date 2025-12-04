const mailer = require('../config/mailer');

class MailService {
  async sendMail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        to,
        subject,
        html,
        text
      };

      await mailer.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error en mailService:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  async sendPasswordResetEmail(user, resetLink) {
    const subject = 'Recuperación de Contraseña - Ecommerce';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Recuperación de Contraseña</h2>
        <p>Hola ${user.first_name},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Restablecer Contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 12px;">
          <strong>Importante:</strong> Este enlace expirará en 1 hora.
        </p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Equipo de Soporte - Ecommerce
        </p>
      </div>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendPasswordChangedEmail(user) {
    const subject = 'Contraseña Actualizada - Ecommerce';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Contraseña Actualizada</h2>
        <p>Hola ${user.first_name},</p>
        <p>Tu contraseña ha sido actualizada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta con soporte inmediatamente.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Equipo de Soporte - Ecommerce
        </p>
      </div>
    `;

    return this.sendMail(user.email, subject, html);
  }

  async sendPurchaseConfirmation(user, ticket) {
    const subject = 'Confirmación de Compra - Ecommerce';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">¡Gracias por tu compra!</h2>
        <p>Hola ${user.first_name},</p>
        <p>Tu compra ha sido procesada exitosamente.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #495057;">Detalles del Ticket</h3>
          <p><strong>Código:</strong> ${ticket.code}</p>
          <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
          <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
          <p><strong>Comprador:</strong> ${user.email}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px;">
          Equipo de Ecommerce
        </p>
      </div>
    `;

    return this.sendMail(user.email, subject, html);
  }
}

module.exports = new MailService();
