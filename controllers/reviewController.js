const Review = require("./../models/reviewModel");
const Product = require("./../models/productModel");
const User = require("./../models/userModel");
const Store = require("./../models/storeModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

//   store/:storeId/product/:productId/reviews/:reviewId

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.store) {
    req.body.store = req.params.storeId;
  }
  const store = await Store.findById(req.body.store);
  if (!store) {
    return next(new AppError("This Store Doesnt Found", 404));
  }

  const product = await Product.findOne({
    _id: req.body.product,
    store: req.body.store,
  });

  if (!product) {
    return next(new AppError("This product Doesnt Found", 404));
  }

  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: "sucess",
    newReview,
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  if (!req.body.user) {
    req.body.user = req.user.id;
  }
  if (!req.body.store) {
    req.body.store = req.params.storeId;
  }

  if (!req.body.product) {
    req.body.product = req.params.productId;
  }

  const store = await Store.findById(req.body.store);
  if (!store) {
    return next(new AppError("This Store Doesnt Found", 404));
  }

  const product = await Product.findOne({
    _id: req.body.product,
    store: req.body.store,
  });

  if (!product) {
    return next(new AppError("This product Doesnt Found", 404));
  }

  const review = await Review.findOne({
    _id: reviewId,
    product: req.body.product,
    store: req.body.store,
  });

  if (!review) {
    return next(new AppError("Review doesn't Found", 404));
  }

  if (req.user.role == "user") {
    if (review.user.toString() !== req.body.user.toString()) {
      return next(new AppError("You Can't Delete this Review", 403));
    }
    await Review.findByIdAndDelete(reviewId);
    return res.status(204).json({
      status: "success",
      data: null,
    });
  }

  if (req.user.role == "owner") {
  }

  await Review.findByIdAndDelete(reviewId);
  res.status(204).json({
    status: "success",
    data: null,
  });
});


exports.getAllReviews = catchAsync(async (req, res, next) => {
   
    if (!req.body.product) {
      req.body.product = req.params.productId;
    }
    if (!req.body.store) {
      req.body.store = req.params.storeId;
    }
    const store = await Store.findById(req.body.store);
    if (!store) {
      return next(new AppError("This Store Doesnt Found", 404));
    }
  
    const product = await Product.findOne({
      _id: req.body.product,
      store: req.body.store,
    });
  
    if (!product) {
      return next(new AppError("This product Doesnt Found", 404));
    }
  
    const reviews = await Review.find({store : req.body.store, product : req.body.product})
    res.status(200).json({
      status: "sucess",
      numOfReviews : reviews.length,
      reviews,
    });
  });

