const Cart = require("./../models/cartModel");
const User = require("./../models/userModel");
const Product = require("./../models/productModel");
const Coupon = require("./../models/couponModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { cart } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not Found", 404));
  }
  let products = [];

  const userCart = await Cart.findOne({ customer: req.user.id });

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i].product;
    object.quantity = cart[i].quantity;
    object.color = cart[i].color;
    const productPrice = await Product.findById(cart[i].product);
    console.log(productPrice);
    object.price = productPrice.price;
    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].quantity;
  }

  userCart.products = products;
  userCart.cartTotal = cartTotal;
  userCart.save();

  res.status(201).json({
    status: "sucess",
    userCart,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.user.id }).select(
    "-customer"
  );
  if (!cart) {
    return next(new AppError("User Cart doesn't exist", 404));
  }

  res.status(200).json({
    status: "sucess",
    cart,
  });
});

exports.deleteAllProductsCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ customer: req.user.id });
  cart.products = [];
  cart.cartTotal = 0;
  await cart.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// route should be like : /cart/applycoupon

// should be protected ..

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { coupon } = req.body;
  if (!coupon) {
    return next(new AppError("Please Enter the Coupon", 404));
  }

  const findCoupon = await Coupon.findOne({
    _id: coupon,
    expirationDate: { $gt: Date.now() },
  });

  if (!findCoupon) {
    return next(new AppError("Please Enter a Valid Coupon", 404));
  }

  const cart = await Cart.findOne({ customer: req.user.id });

  if (cart.products.length === 0) {
    return next(
      new AppError(
        "Please add items to your cart before applying a coupon code.",
        400
      )
    );
  }

  if (findCoupon.type === "fixed") {
    if (findCoupon.discount >= cart.cartTotal) {
      return next(
        new AppError(
          "Sorry, this coupon cannot be applied because the cart total is equal or less than fixed discount amount."
        )
      );
    }
    cart.cartTotal -= findCoupon.discount;
  }

  if (findCoupon.type === "percentage") {
    let discount = cart.cartTotal * (findCoupon.discount / 100);
    cart.cartTotal = cart.cartTotal - discount;
  }


  await cart.save();

  res.status(200).json({
    status: "message",
    totalAfterDiscount: cart.cartTotal,
  });
});
