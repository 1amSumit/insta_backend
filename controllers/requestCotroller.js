const Requests = require("../models/requestModel");
const catchAsync = require("../utils/catchAsync");

exports.sendFollowRequest = catchAsync(async (req, res, next) => {
  const senderUser = req.user;
  const recieverUser = req.params.userId;

  const requestCreated = await Requests.create({
    senderUser: senderUser,
    recieverUser: recieverUser,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    message: "Request sent",
  });
});
