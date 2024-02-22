const express = require("express");
const requestController = require("../controllers/requestCotroller");
const usersController = require("../controllers/usersController");

const router = express.Router();

router
  .route("/sendRequest/:user")
  .post(usersController.protect, requestController.sendFollowRequest);

module.exports = router;
