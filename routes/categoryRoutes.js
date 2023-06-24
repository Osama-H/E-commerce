const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.CreateCategory
  ).get(categoryController.getAllCategory)

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  ).get(categoryController.getCategory)

module.exports = router;

