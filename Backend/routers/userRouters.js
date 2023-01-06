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
router.route('/:id').put(userController.updateUser);

router.post('/createUser', userController.createUser);
router.post('/getUserLoginGoogle', userController.getUserLoginGoogle);

module.exports = router;
