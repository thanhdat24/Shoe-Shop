const express = require('express');
const brandController = require('../controllers/brandController');

const router = express.Router();

router
  .route('/')
  .post(brandController.createBrand)
  .get(brandController.getAllBrand);

router
  .route('/:id')
  .delete(brandController.deleteBrand)
  .get(brandController.getDetailBrand)
  .put(brandController.updateBrand);

module.exports = router;
