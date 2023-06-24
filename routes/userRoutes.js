const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');


router.route('/').post(userController.createUser)

router.route('/signup').post(authController.signUp)
router.route('/emailVerify/:userId').patch(authController.verificationProcess)
router.route('/login').post(authController.userlogin)
router.route('/admin-login').post(authController.adminLogin)
router.route('/logout').get(authController.protect,authController.logout)



router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:resetToken').patch(authController.resetPassword);

router.route('/updatePassword').patch(authController.updatePassword)


router.route('/save-address').patch(authController.protect,userController.saveAddress)


router.route('/block-user/:id').patch(authController.protect,userController.blockUser)
router.route('/unblock-user/:id').patch(authController.protect,userController.unblockUser)




// This is For Admin

router.route('/').get(authController.protect,userController.getAllUsers)
router.route('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser)

module.exports = router;