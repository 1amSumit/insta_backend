const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");

exports.addComment = catchAsync(async (req, res, next) => {
  const comment = req.body.comment;
  if (!comment) {
    throw new Error("Please provide a comment");
  }

  const commentCreated = await Comment.create({
    comment,
    post: req.params.postId,
    user: req.user,
  });

  res.status(200).json({
    status: "Success",
    commentCreated,
  });
  next();
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find();

  res.status(200).json({
    status: "seccess",
    results: comments.length,
    comments,
  });
  next();
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: `Comment deleted successfully with id ${req.params.id}`,
  });
});

exports.updateCommnet = catchAsync(async (req, res, next) => {
  const newComment = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body.comment
  );
  res.status(200).json({
    status: "success",
    newComment,
  });
});
