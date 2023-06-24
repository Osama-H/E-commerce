const Coupon = require("./../models/couponModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.createCoupon = catchAsync(async (req, res, next) => {
  if(req.body.type === 'percentage' && req.body.discount > 100){
    return next(new AppError("Sorry, the percentage discount cannot be greater than 100%.",400))
  }
  const newCoupon = await Coupon.create(req.body);
  res.status(200).json({
    status: "success",
    newCoupon,
  });
});

exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    numOfCoupons: coupons.length,
    coupons,
  });
});

exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    return next(new AppError("No Coupon Found", 404));
  }

  res.status(200).json({
    status: "success",
    coupon,
  });
});

exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    return next(new AppError("No Coupon Found", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

