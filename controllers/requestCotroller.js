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

exports.acceptRequest = catchAsync(async (req, res, next) => {
  const userToBeAccepted = req.params.user;
  const userIsAccepting = req.user.username;

  const requestDoc = await Requests.findOneAndUpdate(
    {
      recieverUser: userIsAccepting,
      senderUser: userToBeAccepted,
    },
    {
      accepted: true,
    }
  );

  if (!requestDoc) {
    return next(new Error("No request doc found with this user."));
  }

  await User.findOneAndUpdate(
    { username: userIsAccepting },
    {
      $push: { followers: userToBeAccepted },
      $inc: { numFollowers: 1 },
      $pull: { requestRec: userToBeAccepted },
      $inc: { numRequestedRec: -1 },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Request accepted",
  });
});
