const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.patch(
  '/updateMe',
  authController.protectUser,
  userController.uploadUserPhoto,
  userController.updateMe
);

router.route('/').get(userController.getAllUser);
router.get('/checkUserExist', userController.checkUserExist);
router.get('/getUserUID', userController.getUserUID);
router
  .route('/:id')
  .patch(userController.updateUser)
  .get(userController.getDetailUser);

router.post('/createUser', userController.createUser);
router.post('/getUserLoginGoogle', userController.getUserLoginGoogle);

module.exports = router;
