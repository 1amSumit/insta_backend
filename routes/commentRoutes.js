const express = require("express");
const commentController = require("../controllers/commentController");
const userController = require("../controllers/usersController");
const router = express.Router();

router.use(userController.protect);

router.get("/getAllComments", commentController.getAllComments);

router.post("/addComment/:postId", commentController.addComment);
router.patch("/updateComment/:postId", commentController.updateCommnet);
router.delete("/deleteComment/:postId", commentController.deleteComment);
module.exports = router;
