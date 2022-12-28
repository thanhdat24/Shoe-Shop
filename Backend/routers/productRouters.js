const express = require('express');
const productRouters = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .post(productRouters.createProduct)
  .get(productRouters.getAllProduct);

router.route('/:id').get(productRouters.getDetailProduct);

module.exports = router;
