const express = require('express');
const productDetailController = require('../controllers/productDetailController');

const router = express.Router();

router
  .route('/')
  .post(productDetailController.createProductDetail)
  .get(productDetailController.getAllProductDetail);

router
  .route('/:productDetailId')
  .delete(productDetailController.deleteProductDetail)
  .get(productDetailController.getDetailProductDetail)
  .put(productDetailController.updateProductDetail);

module.exports = router;
