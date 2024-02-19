const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addComment = catchAsync(async (req, res, next) => {
  const comment = req.body.comment;
  if (!comment) {
    return next(new AppError("Please add Comment to Update"));
  }

  const commentCreated = await Comment.create({
    comment,
    post: req.params.postId,
    user: req.user,
    createdAt: Date.now(),
  });

  res.status(200).json({
    status: "Success",
    commentCreated,
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "seccess",
    results: comments.length,
    comments,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.comId);
  res.status(200).json({
    status: "success",
    message: `Comment deleted successfully with id ${req.params.comId}`,
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndUpdate(req.params.comId, {
    comment: req.body.comment,
  });

  res.status(200).json({
    status: "success",
    message: "Your comment has been updated",
  });
});
