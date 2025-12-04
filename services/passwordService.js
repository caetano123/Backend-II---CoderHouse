const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const PasswordResetToken = require('../models/PasswordResetToken');
const mailService = require('./mailService');

class PasswordService {
  async requestPasswordReset(email) {
    // Buscar usuario por email
    const user = await userRepository.getByEmail(email);
    if (!user) {
      return { 
        success: false, 
        message: 'Usuario no encontrado' 
      };
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Fecha de expiración (1 hora desde ahora)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar token en la base de datos
    await PasswordResetToken.create({
      userId: user._id,
      token: tokenHash,
      expiresAt,
      used: false
    });

    // Construir enlace de recuperación
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    // Enviar correo
    const mailOptions = {
      to: user.email,
      subject: 'Recuperación de Contraseña',
      html: `
        <h2>Recuperación de Contraseña</h2>
        <p>Hola ${user.first_name},</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
        <p><a href="${resetLink}">Restablecer Contraseña</a></p>
        <p><strong>Este enlace expirará en 1 hora.</strong></p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `
    };

    await mailService.sendMail(mailOptions);

    return { 
      success: true, 
      message: 'Correo enviado exitosamente' 
    };
  }

  async resetPassword(token, newPassword) {
    // Hash del token recibido
    const tokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar token válido
    const resetToken = await PasswordResetToken.findOne({
      token: tokenHash,
      used: false,
      expiresAt: { $gt: new Date() }
    }).populate('userId');

    if (!resetToken) {
      return { 
        success: false, 
        message: 'Token inválido o expirado' 
      };
    }

    const user = resetToken.userId;

    // Verificar que la nueva contraseña no sea igual a la anterior
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return { 
        success: false, 
        message: 'La nueva contraseña no puede ser igual a la anterior' 
      };
    }

    // Hashear nueva contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña del usuario
    await userRepository.update(user._id, { password: passwordHash });

    // Marcar token como usado
    resetToken.used = true;
    await resetToken.save();

    // Enviar correo de confirmación
    const mailOptions = {
      to: user.email,
      subject: 'Contraseña Actualizada',
      html: `
        <h2>Contraseña Actualizada</h2>
        <p>Hola ${user.first_name},</p>
        <p>Tu contraseña ha sido actualizada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta con soporte inmediatamente.</p>
      `
    };

    await mailService.sendMail(mailOptions);

    return { 
      success: true, 
      message: 'Contraseña actualizada exitosamente' 
    };
  }
}

module.exports = new PasswordService();