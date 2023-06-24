const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category Must Have a Name"],
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Category Must Have a Description"],
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Category Must Be assigned to an Admin"],
  }
});

module.exports = mongoose.model('Category',categorySchema);
