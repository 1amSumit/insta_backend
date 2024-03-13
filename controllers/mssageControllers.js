const Message = require("../models/messageModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const messageBody = req.body.message;
  const sender = req.user;
  const reciever = req.params.user;

  if (!messageBody) {
    return next(new AppError("Message is not present."));
  }

  const receiverUser = await User.findOne({ username: reciever });

  const newMessage = await Message.create({
    message: messageBody,
    from: sender._id,
    to: receiverUser._id,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    newMessage,
  });
});

exports.getMessageOfUsers = catchAsync(async (req, res, next) => {
  const sender = req.user;
  const reciever = req.params.user;
  const receiverUser = await User.findOne({ username: reciever });

  const messages = await Message.find({
    from: sender._id,
    to: receiverUser._id,
  });

  res.status(200).json({
    status: "success",
    results: messages.length,
    messages,
  });
});

exports.updateMessage = catchAsync(async (req, res, next) => {
  const messageId = req.params.messageId;
  const updatedMessage = req.body.message;
  await Message.findByIdAndUpdate(messageId, { message: updatedMessage });

  res.status(200).json({
    status: "success",
    message: "Message Updated",
  });
});
