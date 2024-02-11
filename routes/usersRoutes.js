const express = require("express");
const usersController = require("../controllers/usersController");
const profilePictureController = require("../controllers/profilePictureController");

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
router.route("/getUser/:username").get(usersController.getUserByUserName);

router
  .route("/uploadProfilePic/:username")
  .patch(
    profilePictureController.uploadProfilePic,
    profilePictureController.uploadProfilePicture
  );

router.get("/getProfileDetails/:username", usersController.getUserByUserName);
router.patch(
  "/removeProfilPic/:username",
  profilePictureController.removeProfilePic
);

module.exports = router;
