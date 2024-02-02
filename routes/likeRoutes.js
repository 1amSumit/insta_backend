const express = require("express");
const likeController = require("../controllers/likeController");
const userController = require("../controllers/usersController");
const router = express.Router();

router.use(userController.protect);
router.get("/getAllLikes", likeController.getAllLikes);
router.post("/giveLike/:postId", likeController.addLike);
router.post("/updateLike/:postId", likeController.updateLike);

module.exports = router;
