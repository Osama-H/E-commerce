const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Product Must have a Title"],
  },
  slug: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "A Product Must have a Description"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "A Product Must have a Price"],
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: [true, "A Product Must Be assigned To a Store"],
  },
  category: [{  // product must be assigned to more than one category, for example man's clothing and t-shirt
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "A Product Must Be assigned To a Category"],
  }],
  author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User",
    required : [true,'A Product Must Be assigned To an Admin']
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Brand'
  },
  sold: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: [true, "Product Quantity Must be Provided"],
  },
  color: {
    type: String,
    required: [true, "Product Color Must be Provided"],
  },
  images: {
    type: Array,
  },
});

productSchema.virtual("left").get(function () {
  return this.quantity - this.sold;
});

productSchema.methods.createSlug = function () {
  this.slug = slugify(this.title, { lowercase: true });
};

module.exports = mongoose.model("Product", productSchema);
