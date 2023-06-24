const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Brand Must Have a title"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Brand Must Have a description"],
    trim: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Brand Must Belong to an Admin"],
  },
});

module.exports = mongoose.model("Brand", brandSchema);
