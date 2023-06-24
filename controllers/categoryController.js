const Category = require("../models/categoryModel");
const Product = require("./../models/productModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.CreateCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedCategory) {
    return next(new AppError("No Category Found", 404));
  }

  res.status(200).json({
    status: "sucess",
    updatedCategory,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory) {
    return next(new AppError("No Category Found", 404));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

exports.getCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return next(new AppError("No Category Found", 404));
  }

  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const products = await Product.find({ category: req.params })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    status: "sucess",
    products,
  });
});

exports.getAllCategory = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  if (categories.length == 0) {
    return next(new AppError("No Categories Found", 404));
  }
  res.status(200).json({
    status: "sucess",
    data: categories,
  });
});
