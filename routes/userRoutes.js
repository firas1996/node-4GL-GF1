const express = require("express");
// const userController = require("../controllers/userController");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { signup, signin, protected } = require("../controllers/authController");
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/").post(createUser).get(protected, getAllUsers);
router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;
