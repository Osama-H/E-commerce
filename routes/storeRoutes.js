const express = require("express");
const router = express.Router();
const authController = require("./../controllers/authController");
const storeController = require("./../controllers/storeController");


const productRouter = require('./productRoutes');

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("bigAdmin"),
    storeController.createStore
  )
  .get(storeController.getAllStores);


router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo('owner',"bigAdmin"),
    storeController.deleteStore
  )
  .patch(
    authController.protect,
    authController.restrictTo("owner", "superVisor", "bigAdmin"),
    storeController.updateStore
  )
  .get(storeController.getStore);


  router.use('/:storeId/product',productRouter)



module.exports = router;





// store/storeId/product