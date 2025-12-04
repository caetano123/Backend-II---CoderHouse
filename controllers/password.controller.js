const passwordService = require('../services/passwordService');
const { validationResult } = require('express-validator');

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: 'El email es requerido' 
      });
    }

    const result = await passwordService.requestPasswordReset(email);
    
    if (!result.success) {
      return res.status(404).json({ 
        message: result.message 
      });
    }

    res.json({ 
      message: 'Correo de recuperación enviado' 
    });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token y nueva contraseña son requeridos' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const result = await passwordService.resetPassword(token, newPassword);
    
    if (!result.success) {
      return res.status(400).json({ 
        message: result.message 
      });
    }

    res.json({ 
      message: 'Contraseña actualizada exitosamente' 
    });
  } catch (error) {
    next(error);
  }
};