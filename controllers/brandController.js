const Brand = require("./../models/brandModel");
const Product = require("./../models/productModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.create(req.body);
  res.status(201).json({
    status: "sucess",
    brand,
  });
});

exports.getBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    return next(new AppError("No Brand Found", 404));
  }
  const page = 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const products = await Product.find({brand : req.params}).skip(skip).limit(limit).select('-brand')
  res.status(200).json({
    status: "sucess",
    products,
  });
});

exports.getAllBrand = catchAsync(async (req, res, next) => {
  const brand = await Brand.find();
  if (brand.length === 0) {
    return next(new AppError("No Brands Found", 404));
  }
  res.status(200).json({
    status: "sucess",
    brand,
  });
});

exports.deleteBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteBrand = await Brand.findByIdAndDelete(id);
  if (!deleteBrand) {
    return next(new AppError("No Brand Found", 404));
  }
  res.status(204).json({
    status: "sucess",
    data: null,
  });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBrand) {
    return next(new AppError("No Brand Found", 404));
  }
  res.status(200).json({
    status: "sucess",
    updatedBrand,
  });
});
