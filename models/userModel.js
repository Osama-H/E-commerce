const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require('validator');

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "FirstName Must Be Exist"],
  },
  secondname: {
    type: String,
    required: [true, "SecondName Must Be Exist"],
  },
  email: {
    type: String,
    required: [true, "Email Must Be Exist"],
    validate : {
      validator : validator.isEmail,
      message : "Please Provide a Valid Email"
    }

  },
  password: {
    type: String,
    required: [true, "Password Must Be Exist"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    // required: [true, "Password Confrim Must Be Exist"],
    validate: {
      validator: function (el) {
        return el == this.password;
      },
      message: "Passwords Aren't the Same",
    },
  },
  role: {
    type: String,
    enum : ['user', "admin", "owner", "superVisor", "bigAdmin"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  address : {
    type : String
  },
  verificationCode: String,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// For password encryption
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  this.passwordChangedAt = Date.now();
  next();
});

// For login
userSchema.methods.comparePasswords = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// for verification process
userSchema.methods.createCode = function () {
  const codeLength = 6; // Define the length of the code
  let code = "";
  while (code.length < codeLength) {
    code += crypto.randomInt(0, 9); // Generate a random digit between 0 and 9 and append it to the code
  }
  this.verificationCode = code;
  return this.verificationCode;
};

// for protect middleware

userSchema.methods.changePasswordAfter = function (JWTTIMEISSUE) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimeStamp > JWTTIMEISSUE;
  }
  return false;
};

// for create Password Reset Token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};




module.exports = mongoose.model("User", userSchema);
