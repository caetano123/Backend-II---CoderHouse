const productRepository = require('../repositories/productRepository');

class ProductService {
  async createProduct(productData) {
    // Verificar que el código no exista
    const existingProduct = await productRepository.findByCode(productData.code);
    if (existingProduct) {
      throw new Error('El código del producto ya existe');
    }

    return await productRepository.create(productData);
  }

  async updateProduct(id, updateData) {
    if (updateData.code) {
      const existingProduct = await productRepository.findByCode(updateData.code);
      if (existingProduct && existingProduct._id.toString() !== id) {
        throw new Error('El código del producto ya existe en otro producto');
      }
    }

    return await productRepository.update(id, updateData);
  }

  async deleteProduct(id) {
    return await productRepository.delete(id);
  }

  async getProductsWithFilters(filters, options) {
    return await productRepository.findAll(filters, options);
  }

  async checkStock(productId, quantity) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.stock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    return product;
  }

  async updateStock(productId, quantity, operation = 'decrease') {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (operation === 'decrease') {
      if (product.stock < quantity) {
        throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
      }
      product.stock -= quantity;
    } else if (operation === 'increase') {
      product.stock += quantity;
    } else {
      throw new Error('Operación no válida');
    }

    await product.save();
    return product;
  }
}

module.exports = new ProductService();