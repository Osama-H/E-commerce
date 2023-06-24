const express = require("express");
const router = express.Router({ mergeParams: true });
const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");

const reviewRouter = require("./reviewRoutes");
const { productImageResize, uploadPhoto } = require("../middleware/uploadImages");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "owner", "bigAdmin"),
    productController.createProduct
  )
  .get(productController.getAllProducts);

router.put(
  "/upload/:id",
  authController.protect,
  authController.restrictTo("owner", "superVisor", "bigAdmin"),
  uploadPhoto.array("images", 10),
  productImageResize,
  productController.uploadImages
);



// router.route('/wishlist').patch(authController.protect, productController.addToWishList);
// router.route('/rating').patch(authController.protect, productController.rating);

router
  .route("/:productId")
  .get(productController.getProduct)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "owner", "superVisor", "bigAdmin"),
    productController.deleteProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo("admin", "owner", "bigAdmin"),
    productController.updateProduct
  );

router.use("/:productId/reviews", reviewRouter);

module.exports = router;
