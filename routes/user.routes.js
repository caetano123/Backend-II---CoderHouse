const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const userController = require('../controllers/user.Controller');

// Ruta protegida
router.get('/profile', passport.authenticate('jwt', { session: false }), userController.getProfile);

module.exports = router;