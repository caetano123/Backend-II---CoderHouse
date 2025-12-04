const User = require('../models/User'); // Importar directamente

class CartService {
  async addToCart(userId, productId, quantity) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Inicializar carrito si no existe
    if (!user.cart) {
      user.cart = { items: [] };
    }

    // Buscar si el producto ya está en el carrito
    const existingItemIndex = user.cart.items.findIndex(
      item => item.product && item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Actualizar cantidad
      user.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Agregar nuevo item
      user.cart.items.push({
        product: productId,
        quantity
      });
    }

    await user.save();
    return { items: user.cart.items };
  }

  async getCart(userId) {
    // ¡IMPORTANTE! Usar .populate() directamente en User
    const user = await User.findById(userId).populate('cart.items.product');
    
    if (!user || !user.cart || !user.cart.items) {
      return { items: [], total: 0 };
    }

    // Calcular total
    let total = 0;
    const items = user.cart.items.map(item => {
      if (!item.product) {
        return null;
      }
      
      const subtotal = item.product.price * item.quantity;
      total += subtotal;
      
      return {
        product: {
          _id: item.product._id,
          title: item.product.title,
          price: item.product.price,
          description: item.product.description
        },
        quantity: item.quantity,
        subtotal
      };
    }).filter(item => item !== null);

    return { items, total };
  }

  async removeFromCart(userId, productId) {
    const user = await User.findById(userId);
    
    if (!user || !user.cart || !user.cart.items) {
      return { items: [] };
    }

    user.cart.items = user.cart.items.filter(
      item => item.product && item.product.toString() !== productId
    );

    await user.save();
    return { items: user.cart.items };
  }

  async clearCart(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.cart = { items: [] };
      await user.save();
    }
    return { items: [] };
  }
}

module.exports = new CartService();