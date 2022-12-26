const express = require('express');
const promotionController = require('../controllers/promotionController');

const router = express.Router();

router.route('/').get(promotionController.getAllPromotion);

// router.use(authController.restrictTo('admin'));
router.route('/').post(promotionController.createPromotion);

router
  .route('/:id')
  .get(promotionController.getDetailPromotion)
  .put(promotionController.updatePromotion)
  .delete(promotionController.deletePromotion);
module.exports = router;
