const mongoose = require("mongoose");

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Store Must Have a Name"],
    trim: true,
    unqiue: true,
  },
  description: {
    type: String,
    required: [true, "Store Must Have a description"],
    trim: true,
  },
  isdisable: {
    type: Boolean,
    default: false,
  },
  numViews: {
    type: Number,
    default: 0,
  },
  logo: {
    type: String,
    default: "",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A Store Must Have An Owner"],
  },
  admin: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

storeSchema.pre(/^find/, function (next) {
  this.find({ isdisable: { $ne: true } });
  next();
});

storeSchema.virtual('products',{
  ref : "Product",
  foreignField : 'store',
  localField : '_id'
})

module.exports = mongoose.model("Store", storeSchema);
