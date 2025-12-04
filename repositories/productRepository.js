const productDao = require('../daos/productDao');

class ProductRepository {
  async findAll(filters = {}, options = {}) {
    try {
      return await productDao.findAll(filters, options);
    } catch (error) {
      throw new Error(`Repository Error - findAll: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await productDao.findById(id);
    } catch (error) {
      throw new Error(`Repository Error - findById: ${error.message}`);
    }
  }

  async create(productData) {
    try {
      return await productDao.create(productData);
    } catch (error) {
      throw new Error(`Repository Error - create: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await productDao.update(id, updateData);
    } catch (error) {
      throw new Error(`Repository Error - update: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await productDao.delete(id);
    } catch (error) {
      throw new Error(`Repository Error - delete: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await productDao.findByCode(code);
    } catch (error) {
      throw new Error(`Repository Error - findByCode: ${error.message}`);
    }
  }

  async updateStock(productId, quantity, operation = 'decrease') {
    try {
      return await productDao.updateStock(productId, quantity, operation);
    } catch (error) {
      throw new Error(`Repository Error - updateStock: ${error.message}`);
    }
  }

  async bulkDecreaseStock(items) {
    try {
      return await productDao.bulkDecreaseStock(items);
    } catch (error) {
      throw new Error(`Repository Error - bulkDecreaseStock: ${error.message}`);
    }
  }
}

module.exports = new ProductRepository();