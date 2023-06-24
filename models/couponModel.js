const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Coupon Must Have a Name"],
    unique: true,
    uppercase: true,
  },
  expirationDate: {
    type: Date,
    required: [true, "A Coupn Must Have an Expire Date"],
  },
  discount: {
    type: Number,
    required: [true, "A Coupn Must Have a Discount"],
  },
  type: {
    type: String,
    enum: ["fixed", "percentage"],
  },
});

module.exports = mongoose.model("Coupon", couponSchema);


couponSchema.pre(/^find/, function (next) {
  this.find({ expirationDate: { $gt: Date.now } });
  next();
});
