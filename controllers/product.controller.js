const productRepository = require('../repositories/productRepository');
const productService = require('../services/productService');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sort, category } = req.query;
    
    const filters = {};
    if (category) filters.category = category;

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null
    };

    const products = await productRepository.findAll(filters, options);
    
    res.json({
      status: 'success',
      payload: products.docs || products,
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productRepository.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({ product });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Validar datos requeridos
    const requiredFields = ['title', 'description', 'price', 'code', 'stock'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return res.status(400).json({ 
          message: `${field} es requerido` 
        });
      }
    }

    const product = await productService.createProduct(productData);
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el producto existe
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    const updatedProduct = await productService.updateProduct(id, updateData);
    
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar que el producto existe
    const existingProduct = await productRepository.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ 
        message: 'Producto no encontrado' 
      });
    }

    await productService.deleteProduct(id);
    
    res.json({
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};