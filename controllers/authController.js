const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("./../models/userModel");
const Cart = require("./../models/cartModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");
const sendEmail = require("./../utils/email");
const { promisify } = require("util");

exports.signUp = catchAsync(async (req, res, next) => {
  console.log(Date.now());
  const email = req.body.email;
  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError("User Already Registerd", 300));
  }

  const newUser = await User.create({
    email: req.body.email,
    firstname: req.body.firstname,
    secondname: req.body.secondname,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  await Cart.create({ customer: newUser.id });

  newUser.createCode();
  await newUser.save();

  const urlVerificationCode = `${req.protocol}://${req.hostname}/api/v1/users/emailVerify/${newUser.verificationCode}`;

  const Options = {
    to: newUser.email,
    subject: "Verify Your Account",
    text: `
      Dear[${newUser.firstname}],
      We're glad you've decided to create an account with us! To ensure the security of your account, we need to verify your email address.
      Please Go To ${urlVerificationCode} To Complete The Verification Proccess
      If you did not initiate this request, please ignore this message.
      Thank you for choosing our service.
      Best regards,
      [Osama E-Commerce APP]`,
  };

  await sendEmail(Options);

  res.status(201).json({
    status: "success",
    message: "Verification Code Sent To Ur Email",
  });
});

exports.verificationProcess = catchAsync(async (req, res, next) => {
  const { code } = req.body;
  const { userId } = req.params;
  if (!code) {
    return next(new AppError("Please Enter the Code", 404));
  }

  const user = await User.findOne({ id: userId, verificationCode: code });

  if (!user || user.isVerified !== false) {
    return next(
      new AppError("No User Found, Or Account Is Alreay Verified! ", 404)
    );
  }

  if (user.verificationCode !== code) {
    return next(new AppError("Please Enter a Valid Verification Code", 403));
  }

  user.verificationCode = undefined;
  user.isVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Your Account Now Is Verified!",
  });
});

exports.userlogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter the Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePasswords(password, user.password))) {
    return next(new AppError("InCorrect Email Or Password", 401));
  }

  // if (user.isVerified !== true) {
  //   return next(new AppError("Please Verifiy Ur Account", 400));
  // }

  if(user.isBlocked){
    return next(new AppError("You've Been Blocked From this Website",403))
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  // res.cookie("Token", token, {
  //   httpOnly: true,
  //   maxAge: 72 * 60 * 60 * 1000,
  // });

  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

// For Admin Login

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please Enter the Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (
    !user ||
    !(await user.comparePasswords(password, user.password)) ||
    user.role === "user"
  ) {
    return next(new AppError("InCorrect Email Or Password", 401));
  }



  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });


  res.status(200).json({
    status: "success",
    user,
    token,
  });
});

// protect Function
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting Token and Check if it's there, and extract it
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You're Not Logged In, Pleasge Login To Complete the Process",
        401
      )
    );
  }

  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decodedPayload.id);
  if (!user) {
    return next(
      new AppError("The User Belonging to this token That doesnt exist", 401)
    );
  }

  if (user.changedPasswordAt) {
    return next(
      new AppError("User Password Recently Changed, Please Login Again", 401)
    );
  }

  req.user = user;
  next();
});

// Just For
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You Dont Have a Permission To Peform That", 401)
      );
    }
    next();
  };
};






// logout function

exports.logout = catchAsync(async (req, res, next) => {
  // res.clearCookie("Token", {
  //   httpOnly: true,
  //   secure: true,
  // });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please Enter an Email", 404));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("You Don't Have An Account on Our Website", 400));
  }

  if(user.isBlocked){
    return next(new AppError("You've Been Blocked From this Website",403))
  }

  const resetToken = user.createPasswordResetToken();
  // console.log(user);
  await user.save({ validateBeforeSave: false });

  const url = `${req.protocol}://${req.hostname}/api/v1/users/resetPassowrd/${resetToken}`;

  const options = {
    to: user.email,
    subject: "Reset Your Password",
    text: `Dear [${user.firstname} ${user.secondname}],

      We have received a request to reset the password for your account. If you did not make this request, please disregard this email.
      
      To reset your password, please click on the link below:
      
      ${url}
      
      
      Please note that this link is only valid for 10 minutes. After that, you will need to request another password reset.
      
      If you have any questions or concerns, please contact us at [Insert contact email or phone number here].
      
      Best regards,
      [Osama E-Commerce APP]`,
  };

  await sendEmail(options);

  res.status(200).json({
    status: "success",
    message: "Password Reset Token Sent To Your Email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = req.params.resetToken;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("User Not Found or The Token Has Expired", 404));
  }

  if(user.isBlocked){
    return next(new AppError("You've Been Blocked From this Website",403))
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  user.passwordChangedAt = Date.now();
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});

// updateThePassword

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { email, currentPassword } = req.body;
  if (!email || !currentPassword) {
    return next(new AppError("Please Provide Your Email and Password", 404));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email Didn't Register In Our APP", 404));
  }
  if(user.isBlocked){
    return next(new AppError("You've Been Blocked From this Website",403))
  }
  if (!(await user.comparePasswords(currentPassword))) {
    return next(new AppError("Password Wrong", 401));
  }

  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(
      new AppError("Enter Your New Password and PasswordConfirm", 404)
    );
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
