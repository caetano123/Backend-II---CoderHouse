const cartService = require('../services/cartService');
const productRepository = require('../repositories/productRepository');

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ 
        message: 'productId es requerido' 
      });
    }

    // Verificar que el producto existe
    const product = await productRepository.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    // Verificar stock
    if (product.stock < quantity) {
      return res.status(400).json({ 
        message: 'Stock insuficiente' 
      });
    }

    const cart = await cartService.addToCart(userId, productId, quantity);
    
    res.json({
      message: 'Producto agregado al carrito',
      cart
    });
  } catch (error) {
    next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.getCart(userId);
    
    res.json({ cart });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({ 
        message: 'productId es requerido' 
      });
    }

    const cart = await cartService.removeFromCart(userId, productId);
    
    res.json({
      message: 'Producto removido del carrito',
      cart
    });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);
    
    res.json({
      message: 'Carrito vaciado',
      cart
    });
  } catch (error) {
    next(error);
  }
};