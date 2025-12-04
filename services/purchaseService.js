// services/purchaseService.js
const Ticket = require('../models/Ticket');
const productRepository = require('../repositories/productRepository');
const userRepository = require('../repositories/userRepository');

class PurchaseService {
  async processPurchase(userId, items) {
    try {
      console.log(`🛒 Procesando compra para usuario: ${userId}`);
      console.log(`📦 Items:`, items);
      
      // Verificar stock y calcular total
      let total = 0;
      const availableItems = [];
      const unavailableItems = [];

      for (const item of items) {
        try {
          const product = await productRepository.findById(item.productId);
          
          if (!product) {
            unavailableItems.push({
              productId: item.productId,
              reason: 'Producto no encontrado'
            });
            continue;
          }

          if (product.stock >= item.qty) {
            // Producto disponible
            availableItems.push({
              product: product._id,
              quantity: item.qty,
              price: product.price
            });
            total += product.price * item.qty;
            console.log(`✅ Producto disponible: ${product.title} x ${item.qty}`);
          } else {
            // Producto sin stock suficiente
            unavailableItems.push({
              productId: item.productId,
              productTitle: product.title,
              requested: item.qty,
              available: product.stock,
              reason: 'Stock insuficiente'
            });
            console.log(`❌ Sin stock: ${product.title} (pedido: ${item.qty}, disponible: ${product.stock})`);
          }
        } catch (productError) {
          console.error(`Error con producto ${item.productId}:`, productError.message);
          unavailableItems.push({
            productId: item.productId,
            reason: `Error: ${productError.message}`
          });
        }
      }

      // Si no hay productos disponibles, error
      if (availableItems.length === 0) {
        throw new Error('No hay productos disponibles para comprar');
      }

      console.log(`💰 Total calculado: $${total}`);
      console.log(`📋 Disponibles: ${availableItems.length}, No disponibles: ${unavailableItems.length}`);

      // Reducir stock de productos disponibles
      for (const item of availableItems) {
        try {
          await productRepository.updateStock(item.product, item.quantity, 'decrease');
          console.log(`📉 Stock reducido para producto: ${item.product}`);
        } catch (stockError) {
          console.error(`Error reduciendo stock:`, stockError.message);
          throw new Error(`Error actualizando stock: ${stockError.message}`);
        }
      }

      // Obtener usuario para email
      const user = await userRepository.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Crear ticket
      const ticketData = {
        amount: total,
        purchaser: user.email,
        items: availableItems
      };

      console.log(`🎫 Creando ticket para: ${user.email}`);
      const ticket = await Ticket.create(ticketData);
      console.log(`✅ Ticket creado: ${ticket.code}`);

      // Limpiar carrito (opcional - si implementaste carrito)
      // Puedes comentar esto si no tienes carrito implementado
      if (user.cart && user.cart.items) {
        user.cart.items = user.cart.items.filter(cartItem => {
          return !availableItems.some(purchased => 
            purchased.product.toString() === cartItem.product?.toString()
          );
        });
        await user.save();
        console.log(`🛒 Carrito actualizado`);
      }

      return {
        success: true,
        ticket: {
          code: ticket.code,
          purchase_datetime: ticket.purchase_datetime,
          amount: ticket.amount,
          purchaser: ticket.purchaser
        },
        unavailableProducts: unavailableItems
      };
    } catch (error) {
      console.error('❌ Error en processPurchase:', error);
      throw new Error(`Error en proceso de compra: ${error.message}`);
    }
  }

  async getTicketsByUser(email) {
    try {
      return await Ticket.find({ purchaser: email }).sort({ purchase_datetime: -1 });
    } catch (error) {
      throw new Error(`Error obteniendo tickets: ${error.message}`);
    }
  }

  async getTicketByCode(code) {
    try {
      return await Ticket.findOne({ code }).populate('items.product');
    } catch (error) {
      throw new Error(`Error obteniendo ticket: ${error.message}`);
    }
  }
}

module.exports = new PurchaseService();