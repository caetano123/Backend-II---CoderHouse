const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authorize = require('../middleware/authorize');
const cartController = require('../controllers/cart.controller');

// Agregar producto al carrito (solo user)
router.post('/add',
  passport.authenticate('jwt', { session: false }),
  authorize('user'),
  cartController.addToCart
);

// Ver carrito (solo user)
router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorize('user'),
  cartController.getCart
);

// Eliminar producto del carrito (solo user)
router.delete('/remove/:productId',
  passport.authenticate('jwt', { session: false }),
  authorize('user'),
  cartController.removeFromCart
);

// Vaciar carrito (solo user)
router.delete('/clear',
  passport.authenticate('jwt', { session: false }),
  authorize('user'),
  cartController.clearCart
);

module.exports = router;