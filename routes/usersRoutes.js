const express = require("express");
const usersController = require("../controllers/usersController");
const profilePictureController = require("../controllers/profilePictureController");

const router = express.Router();

router
  .route("/getAllUsers")
  .get(usersController.protect, usersController.getAllUsers);
router.route("/signup").post(usersController.signup);
router
  .route("/getUser/:userId")
  .get(usersController.protect, usersController.getUserById);
router
  .route("/deleteUser/:userId")
  .delete(usersController.protect, usersController.deleteUser);
router.route("/login").post(usersController.login);
router
  .route("/getUser/:username")
  .get(usersController.protect, usersController.getUserByUserName);

router
  .route("/uploadProfilePic/:username")
  .patch(
    usersController.protect,
    profilePictureController.uploadProfilePic,
    profilePictureController.uploadProfilePicture
  );

router.get(
  "/getProfileDetails/:username",
  usersController.protect,
  usersController.getUserByUserName
);
router.patch(
  "/removeProfilPic/:username",
  usersController.protect,
  profilePictureController.removeProfilePic
);
router
  .route("/searchUser")
  .get(usersController.protect, usersController.searchUserByName);

router
  .route("/follow/:userId")
  .post(usersController.protect, usersController.followUser);
module.exports = router;
