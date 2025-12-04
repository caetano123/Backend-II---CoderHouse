const mongoose = require('mongoose');
const Product = require('../models/Product');

class ProductDao {
  // CREATE
  async create(doc) { 
    return Product.create(doc); 
  }

  // READ
  async findById(id) { 
    return Product.findById(id); 
  }

  async findAll(filters = {}, options = {}) {
    try {
      const { limit = 10, page = 1, sort = null, ...queryOptions } = options;
      
      const query = Product.find(filters);

      // Aplicar ordenamiento
      if (sort) {
        if (sort === 'asc' || sort === 'desc') {
          query.sort({ price: sort === 'asc' ? 1 : -1 });
        } else if (typeof sort === 'object') {
          query.sort(sort);
        }
      }

      // Aplicar paginación
      const skip = (page - 1) * limit;
      query.skip(skip).limit(parseInt(limit));

      // Ejecutar consulta
      const products = await query.exec();
      const total = await Product.countDocuments(filters);
      const totalPages = Math.ceil(total / limit);

      return {
        docs: products,
        total,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      };
    } catch (error) {
      throw new Error(`Error en findAll: ${error.message}`);
    }
  }

  // Método genérico (opcional)
  async find(filter = {}, options = {}) { 
    return Product.find(filter, null, options); 
  }

  // UPDATE
  async update(id, update) { 
    return Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }); 
  }

  // DELETE
  async delete(id) { 
    return Product.findByIdAndDelete(id); 
  }

  // FIND BY CODE
  async findByCode(code) {
    return Product.findOne({ code });
  }

  // UPDATE STOCK
  async updateStock(productId, quantity, operation = 'decrease') {
    const product = await Product.findById(productId);
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
    }

    return await product.save();
  }

  // Bulk stock decrease en transacción
  async bulkDecreaseStock(items) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const it of items) {
        const p = await Product.findById(it.productId).session(session);
        if (!p) throw new Error(`Producto ${it.productId} no existe`);
        if (p.stock < it.qty) throw new Error(`Stock insuficiente para ${p._id}`);
        p.stock -= it.qty;
        await p.save({ session });
      }
      await session.commitTransaction();
      session.endSession();
      return true;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

module.exports = new ProductDao();