const express = require('express');
const router = express.Router();

const brandController = require("../controllers/brandController");
const authController = require("../controllers/authController");
const productController = require("./../controllers/productController");

const productRouter = require('./productRoutes');


router.route('/').post(authController.protect,authController.restrictTo('superVisor','bigAdmin'),brandController.createBrand).get(brandController.getAllBrand)
router.route('/:id').delete(authController.protect,authController.restrictTo('superVisor','bigAdmin'),brandController.deleteBrand).patch(authController.protect,authController.restrictTo('superVisor','bigAdmin'),brandController.updateBrand).get(brandController.getBrand)



// '/brands/:brandName/products'

// this is wrong
router.get('/:brandId/products',productController.getAllProductsForBrand)


module.exports = router;





