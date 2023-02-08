const express = require('express');
const productRouters = require('../controllers/productController');

const router = express.Router();

router.get('/search', productRouters.searchProduct);
router.get('/search-gender', productRouters.searchGender);
router.get('/best-seller-products', productRouters.bestSellerProduct);

router
  .route('/')
  .post(productRouters.createProduct)
  .get(productRouters.getAllProduct);

router.route('/id/:id').get(productRouters.getDetailProduct);
router.route('/product').get(productRouters.getDetailProductByName);
module.exports = router;
