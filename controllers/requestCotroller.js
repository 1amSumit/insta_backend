const Requests = require("../models/requestModel");
const catchAsync = require("../utils/catchAsync");

exports.sendFollowRequest = catchAsync(async (req, res, next) => {
  const senderUser = req.user._id;
  const recieverUser = req.params.userId;

  await Requests.create({
    senderUser: senderUser,
    recieverUser: recieverUser,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    message: "Request sent",
  });
});

exports.recieveFollowRequest = catchAsync(async (req, res, next) => {
  const senderUser = req.params.userId;
  const recieverUser = req.user._id;
});
