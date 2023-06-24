const uniqid = require("uniqid");
const Order = require("./../models/couponModel");
const Cart = require("./../models/cartModel");
const Product = require("./../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/AppError");

// C0D => Cash On Deleviry

exports.createOrder = catchAsync(async (req, res, next) => {
  const { COD } = req.body;
  if (!COD) {
    return next(new AppError("Create Cash order faild", 400));
  }

  const cart = await Cart.findOne({ customer: req.user.id });
  if (!cart) {
    return next(new AppError("User doesn't have a Cart", 404));
  }

  const newOrder = await Order.create({
    products: cart.products,
    paymentintent: {
      id: uniqid(),
      method: "COD",
      finalAmount: cart.cartTotal,
      status: "Cash On Delivery",
      currency: "usd",
    },
    customer: req.user.id,
    orderstatus: "Cash On Delivery",
  });

  const ourProducts = newOrder.products;
  for (let i = 0; i < ourProducts.length; i++) {
    const product = await Product.findById(ourProducts[i].product);
    product.quantity -= ourProducts[i].quantity;
    product.sold += ourProducts[i].sold;
    await product.save();
  }
  res.status(200).json({
    status: "success",
    newOrder,
  });
});
