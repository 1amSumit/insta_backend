const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

router
  .route("/getAllUsers")
  .get(usersController.protect, usersController.getAllUsers);
router.route("/signup").post(usersController.signup);
router.route("/getUser/:userId").get(usersController.getUserById);
router
  .route("/deleteUser/:userId")
  .delete(usersController.protect, usersController.deleteUser);
router.route("/login").post(usersController.login);

module.exports = router;
