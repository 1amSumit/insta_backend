const express = require("express");
const likeController = require("../controllers/likeController");
const userController = require("../controllers/usersController");
const router = express.Router();

router.use(userController.protect);

router.post("/giveLike/:postId", likeController.addLike);

module.exports = router;
