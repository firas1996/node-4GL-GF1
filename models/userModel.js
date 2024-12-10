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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
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
  password_updated_at: {
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

userSchema.methods.changedPasswordDate = function (JWTTime) {
  const passUpdateTime = parseInt(this.password_updated_at.getTime() / 1000);
  // console.log("aaa");
  console.log(JWTTime);
  console.log(passUpdateTime);
  return JWTTime < passUpdateTime;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
