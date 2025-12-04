const nodemailer = require('nodemailer');
require('dotenv').config();

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendMail(mailOptions) {
    try {
      const defaultOptions = {
        from: process.env.EMAIL_FROM || 'noreply@ecommerce.com',
      };

      const options = { ...defaultOptions, ...mailOptions };
      const info = await this.transporter.sendMail(options);
      
      console.log('Correo enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error al enviar correo:', error);
      throw error;
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Servidor de correo listo para enviar mensajes');
      return true;
    } catch (error) {
      console.error('Error al verificar conexión con servidor de correo:', error);
      return false;
    }
  }
}

module.exports = new Mailer();