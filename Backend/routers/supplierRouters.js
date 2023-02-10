const express = require('express');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

router
  .route('/')
  .post(supplierController.createSupplier)
  .get(supplierController.getAllSupplier);

router
  .route('/:id')
  .delete(supplierController.deleteSupplier)
  .get(supplierController.getDetailSupplier)
  .patch(supplierController.updateSupplier);
module.exports = router;
