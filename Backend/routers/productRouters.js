const express = require('express');
const productRouters = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .post(productRouters.createProduct)
  .get(productRouters.getAllProduct);

router
  .route('/:objectUseId')
  .delete(productRouters.deleteProduct)
  .get(productRouters.getDetailProduct)
  .put(productRouters.updateProduct);

module.exports = router;
