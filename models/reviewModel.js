const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review Cant Be Empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Review Must belong to a user"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Review Must belong to a Product"],
  },
  store : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "Review Must belong to a Store"],
  }
});

module.exports = mongoose.model('Review',reviewSchema);
