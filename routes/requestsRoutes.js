const express = require("express");
const requestController = require("../controllers/requestCotroller");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.use(usersController.protect);

router.route("/sendRequest/:user").post(requestController.sendFollowRequest);

router.post("/acceptRequest/:user", requestController.acceptRequest);

module.exports = router;
