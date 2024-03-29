const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const postController = require("../controllers/postController");

router.route("/getAllPosts").get(postController.getAllPosts);
router.use(usersController.protect);

router
  .route("/uploadPost")
  .post(postController.postUpload, postController.fileSaving);

router.route("/currentUserPost").get(postController.getPostOfLoggedInUser);

router.route("/getUserPost/:user").get(postController.getUserPosts);

router
  .route("/getFeed")
  .get(usersController.protect, postController.getLoggedInUserFeed);

module.exports = router;
