const Requests = require("../models/requestModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.sendFollowRequest = catchAsync(async (req, res, next) => {
  const senderUser = req.user.username;
  const recieverUser = await User.findOne({ username: req.params.user });
  const recieverUsername = recieverUser.username;
  await Requests.create({
    senderUser: senderUser,
    recieverUser: recieverUsername,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    message: "Request sent",
  });
});
