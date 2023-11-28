const express = require('express');
const objectUseController = require('../controllers/objectUseController');

const router = express.Router();

router
  .route('/')
  .post(objectUseController.createObjectUse)
  .get(objectUseController.getAllObjectUse);

router
  .route('/:id')
  .delete(objectUseController.deleteObjectUse)
  .get(objectUseController.getDetailObjectUse)
  .put(objectUseController.updateObjectUse);

module.exports = router;
