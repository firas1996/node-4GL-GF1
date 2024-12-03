const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const myToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      age: req.body.age,
    });
    res.status(201).json({
      status: "success",
      message: "User Added !!!",
      data: { newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "email or password are empty",
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: "fail",
        message: "email or password are incorrect",
      });
    }
    const token = myToken(user._id, user.name);
    res.status(200).json({
      status: "success",
      token,
      message: "Legged in !!!",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
