const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authorize = require('../middleware/authorize');
const productController = require('../controllers/product.controller');

// GET todos los productos (público)
router.get('/', productController.getAllProducts);

// GET producto por ID (público)
router.get('/:id', productController.getProductById);

// POST crear producto (solo admin)
router.post('/', 
  passport.authenticate('jwt', { session: false }), 
  authorize('admin'),
  productController.createProduct
);

// PUT actualizar producto (solo admin)
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  productController.updateProduct
);

// DELETE eliminar producto (solo admin)
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  authorize('admin'),
  productController.deleteProduct
);

module.exports = router;