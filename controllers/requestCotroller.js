const Requests = require("../models/requestModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

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
    },
    { new: true }
  );

  if (!requestDoc) {
    return next(new Error("No request doc found with this user."));
  }

  await User.findOneAndUpdate(
    { username: userIsAccepting },
    {
      $push: { followers: userToBeAccepted },
      $pull: { requestRec: userToBeAccepted },
      $inc: { numFollowers: 1, numRequestedRec: -1 },
    },
    { new: true }
  );

  await User.findOneAndUpdate(
    { username: userToBeAccepted },
    { $push: { followings: userIsAccepting }, $inc: { numFollowings: 1 } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Request accepted",
  });
});

exports.hasAccepted = catchAsync(async (req, res, next) => {
  const userLoggedIn = req.user.username;
  const anotherUser = req.params.user;

  if (userLoggedIn === anotherUser) {
    res.status(501).json({
      status: "success",
      message: "user is the same as the logged-in user",
    });

    return next(new AppError("Can't send a request to oneself"));
  }

  const isAccepted = await Requests.findOne({
    senderUser: userLoggedIn,
    recieverUser: anotherUser,
  });

  if (!isAccepted) {
    return next(new AppError("User is not yet accepted."));
  }

  res.status(200).json({
    status: "success",
    isAccepted: isAccepted.accepted,
  });
});
