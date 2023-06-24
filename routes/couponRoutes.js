const express = require("express");
const router = express.Router();
const couponController = require("./../controllers/couponController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("bigAdmin"),
    couponController.createCoupon
  )
  .get(
    authController.protect,
    authController.restrictTo("superVisor", "bigAdmin"),
    couponController.getAllCoupons
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("bigAdmin"),
    couponController.updateCoupon
  ).delete(
    authController.protect,
    authController.restrictTo("bigAdmin"),
    couponController.deleteCoupon
  )

module.exports = router;
