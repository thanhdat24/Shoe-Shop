const express = require('express');
const addressController = require('../controllers/addressController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(addressController.getAllAddress);

router.post('/', authController.protectUser, addressController.createAddress);
router.get(
  '/getMeAddress',
  authController.protectUser,
  addressController.getMeAddress
);

router
  .route('/:id')
  .delete(addressController.deleteAddress)
  .get(addressController.getDetailAddress)
  .patch(addressController.updateAddress);
module.exports = router;
