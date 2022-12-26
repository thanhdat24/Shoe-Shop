const express = require('express');
const sizeController = require('../controllers/sizeController');

const router = express.Router();

router
  .route('/')
  .post(sizeController.createSize)
  .get(sizeController.getAllSize);

router
  .route('/:sizeId')
  .delete(sizeController.deleteSize)
  .get(sizeController.getDetailSize)
  .put(sizeController.updateSize);

module.exports = router;
