const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const isValidId = require("./../utils/mongooseIdValidation");

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: "fail",
    message: "Route Doesnt Exist, Please Use /signup instead.",
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    length: users.length,
    users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No User Found With this Id", 404));
  }
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError("No User Found With this Id", 404));
  }
  res.status(204).json({
    status: "success",
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new AppError("No User Found With this Id", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

// save UserAddress

exports.saveAddress = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  if (!req.body.address) {
    return next(new AppError("Please Provide Your Address", 404));
  }
  const user = await User.findByIdAndUpdate(
    _id,
    {
      address: req.body.address,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    return next(new AppError("User Not Found", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.blockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }
  if (user.isBlocked !== false) {
    return next(new AppError("User Already Blocked", 403));
  }
  user.isBlocked = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: `${user.firstname} ${user.secondname} Blocked Successfully`,
  });
});

exports.unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User Not Found", 404));
  }
  if (user.isBlocked !== true) {
    return next(new AppError("User Already UnBlocked", 403));
  }
  user.isBlocked = false;
  await user.save();

  res.status(200).json({
    status: "success",
    message: `${user.firstname} ${user.secondname} unBlocked Successfully`,
  });
});
