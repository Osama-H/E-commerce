const mongoose = require("mongoose");

const orderSchema = await mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qunatity: Number,
      color: String,
    },
  ],

  paymentintent: {},
  orderstatus: {
    type: String,
    default: "f",
    enum: [
      "pending",
      "Not Processed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
  },
  customer : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : [true,'Order Must Belong to a User']
  }
});

module.exports = mongoose.model('Order',orderSchema)