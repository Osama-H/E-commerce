const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: {
        type : Number,
        default : 1
      },
      color: String,
    },
  ],
  
  cartTotal: Number,
  totalAfterDiscount: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Cart Must Belong to a User"],
  },
});

module.exports = mongoose.model("Cart", cartSchema);
