const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController");
const messageControllers = require("../controllers/mssageControllers");

router.use(userController.protect);
router.route("/getMessages/:user").get(messageControllers.getMessageOfUsers);
router
  .route("/updateMessage/:messageId")
  .patch(messageControllers.updateMessage);

router.get("/getInbox", messageControllers.getInbox);

router.post("/sendMessageAllUsers", messageControllers.sendMessageAllUsers);

module.exports = router;
