const express = require('express');
const router = express.Router();

const cartController = require('./../controllers/cartController')
const authController = require('./../controllers/authController');


router.route('/deleteProducts').delete(authController.protect,cartController.deleteAllProductsCart)
router.route('/addproducts').patch(authController.protect, cartController.addProductToCart)
router.route('/mycart').get(authController.protect,cartController.getCart)






module.exports = router;