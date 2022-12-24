const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router
  .route('/')
  .post(categoryController.createCategory)
  .get(categoryController.getAllCategory);

router
  .route('/:categoryId')
  .delete(categoryController.deleteCategory)
  .get(categoryController.getDetailCategory)
  .put(categoryController.updateCategory);
  
module.exports = router;
