const express = require("express");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/usersController");
const router = express.Router();

router.use(userController.protect);

router.get("/getAllComments", commentController.getAllComments);

router.post("/addComment/:postId", commentController.addComment);

module.exports = router;
