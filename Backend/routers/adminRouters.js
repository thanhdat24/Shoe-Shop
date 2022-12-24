const express = require('express');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const router = express.Router();

//Protect all routers after this middleware
router.use(authController.protect);

router.get('/getMe', authController.getMe, adminController.getDetailAdmin);

router.patch(
  '/updateMe',
  adminController.uploadUserPhoto,
  adminController.updateMe
);

// RestrictTo "admin"
// router.use(authController.restrictTo('admin'));

router.route('/').get(adminController.getAllAdmins);

router
  .route('/:id')
  .put(adminController.updateAdmin)
  .delete(adminController.deleteAdmin);

module.exports = router;
