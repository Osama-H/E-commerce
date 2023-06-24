const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  ).get(reviewController.getAllReviews);

router
  .route("/:reviewId")
  .delete(
    authController.protect,
    authController.restrictTo("user", "owner", "superVisor", "bigAdmin"),
    reviewController.deleteReview
  );

module.exports = router;
