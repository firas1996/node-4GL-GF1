const User = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
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

exports.getAllUsers = async (req, res) => {
  try {
    const extraFields = ["page", "limit", "sort"];
    console.log(req.query);
    let queryObj = { ...req.query }; // age: {$gt:50}
    extraFields.forEach((element) => {
      delete queryObj[element];
    });
    // const users = await User.find().where("name").equals(req.query.name);
    // 1) Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lt|lte|gt|gte)\b/g, (opt) => `$${opt}`);
    let querry = User.find(JSON.parse(queryStr));

    // 2) Pagination:

    const page = req.query.page || 1;
    const limit = req.query.limit || 6;
    const skip = (page - 1) * limit;
    querry = querry.skip(skip).limit(limit);

    // 3) Sorting:

    if (req.query.sort) {
      const sort = req.query.sort.split(",").join(" ");
      querry = querry.sort(sort);
    } else {
      querry = querry.sort("-created_at");
    }

    const users = await querry;

    res.status(200).json({
      status: "success",
      results: users.length,
      message: "Users Fetched !!!",
      data: { users },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      // results: users.length,
      message: "Users Fetched !!!",
      data: { user },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// Update user

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      message: "User Updated !",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

// Delete user

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "User Deleted !",
    });
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
