const express = require('express');
const shoesRouters = require('../controllers/shoesController');

const router = express.Router();

router
  .route('/')
  .post(shoesRouters.createShoes)
  .get(shoesRouters.getAllShoes);

router
  .route('/:objectUseId')
  .delete(shoesRouters.deleteShoes)
  .get(shoesRouters.getDetailShoes)
  .put(shoesRouters.updateShoes);

module.exports = router;
