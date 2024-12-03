const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  // name:String
  name: {
    type: String,
    // required:true
    required: [true, "A user name is required !!!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "A user email is required !!!"],
    unique: true,
    validate: [validator.isEmail, "Email is not valid !!"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "A user password is required !!!"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, "A user password is required !!!"],
    minlength: 8,
    valdiate: {
      validator: function (c) {
        return c === this.password;
      },
      message: "passowrd and confirmPassword does not match !!!",
    },
  },
  age: {
    type: Number,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (pass, cPass) {
  return await bcrypt.compare(pass, cPass);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
