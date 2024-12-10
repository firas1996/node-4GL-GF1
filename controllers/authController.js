const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

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

exports.protected = async (req, res, next) => {
  try {
    let token;
    // 1) no5thou el token w nthabtou mawjouda wala lé
    // console.log("aaa");
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // console.log("zzz");
      token = req.headers.authorization.split(" ")[1];
      // console.log("eee");
    }
    console.log(token);
    if (!token) {
      return res.status(401).json({
        message: "you are not logged in !!!!",
      });
    }
    // 2) vérifier si la token est valid ou pas

    const decodedJWT = await promisify(jwt.verify)(
      token,
      process.env.SECRET_KEY
    );
    console.log(decodedJWT);

    // 3) thabat moula el token mizel mawjoud wala tfasa5

    // console.log("tttt");
    const theUser = await User.findById(decodedJWT.id);
    if (!theUser) {
      return res.status(401).json({
        message: "this user is no longer exists ... !!!!",
      });
    }

    // 4) thabat el user badal el pass ba3d ma 5thi el token wala lé
    if (theUser.changedPasswordDate(decodedJWT.iat)) {
      return res.status(401).json({
        message: "this session is expired please try and login again ... !!!!",
      });
    }

    next();
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
