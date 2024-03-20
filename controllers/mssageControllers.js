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

  const newMessage = await Message.create({
    message: messageBody,
    from: sender._id,
    to: reciever,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "success",
    newMessage,
  });
});

exports.getMessageOfUsers = catchAsync(async (req, res, next) => {
  const sender = req.user;
  const receiver = req.params.user;

  const messages = await Message.find({
    $or: [
      { from: sender, to: receiver },
      { from: receiver, to: sender },
    ],
  }).sort({ createdAt: 1 });

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

exports.getInbox = catchAsync(async (req, res, next) => {
  const sender = req.user;

  const inbox = await Message.find({ from: sender._id }).sort({
    createdAt: -1,
  });

  const inboxArr = [];
  inbox.forEach((message) => {
    const exists = inboxArr.some((item) => item.id === message.to.toString());
    if (!exists) {
      inboxArr.push({
        id: message.to.toString(),
        lastMessage: message.message,
      });
    }
  });

  res.status(200).json({
    status: "success",
    inboxArr,
  });
});
