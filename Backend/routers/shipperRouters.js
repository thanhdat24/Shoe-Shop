const express = require('express');
const shipperController = require('../controllers/shipperController');

const router = express.Router();

router
  .route('/')
  .post(shipperController.createShipper)
  .get(shipperController.getAllShipper);

router
  .route('/:shipperId')
  .delete(shipperController.deleteShipper)
  .get(shipperController.getDetailShipper)
  .put(shipperController.updateShipper);

module.exports = router;
