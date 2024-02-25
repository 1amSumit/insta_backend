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

  await User.findOneAndUpdate(
    { username: userToBeAccepted },
    { $push: { followings: userIsAccepting }, $inc: { numFollowings: 1 } }
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
      message: "user is same as logged in user",
    });

    return next();
  }

  const isAccepted = await Requests.findOne({
    senderUser: userLoggedIn,
    recieverUser: anotherUser,
  });

  if (!isAccepted) {
    return next();
  }

  res.status(200).json({
    status: "success",
    isAccepted: isAccepted.accepted,
  });
});
