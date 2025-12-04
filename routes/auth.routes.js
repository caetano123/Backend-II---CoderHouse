const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/auth.Controller');
const passwordController = require('../controllers/password.controller');

// Registro
router.post('/register', authController.register);

// Login usando passport local pero sin sesión
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas', info });
    req.user = user;
    return authController.login(req, res, next);
  })(req, res, next);
});

// Ruta /current protegida por JWT
router.get('/current', passport.authenticate('jwt', { session: false }), authController.current);

// Ejemplo de admin
router.get('/admin-only', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Acceso denegado' });
  res.json({ message: 'Bienvenido admin' });
});

// Recuperación de contraseña
router.post('/forgot-password', passwordController.requestPasswordReset);
router.post('/reset-password/:token', passwordController.resetPassword);

module.exports = router;