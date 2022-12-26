const express = require('express');
const colorController = require('../controllers/colorController');

const router = express.Router();

router
  .route('/')
  .post(colorController.createColor)
  .get(colorController.getAllColor);

router
  .route('/:colorId')
  .delete(colorController.deleteColor)
  .get(colorController.getDetailColor)
  .put(colorController.updateColor);

module.exports = router;
