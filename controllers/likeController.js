const catchAsync = require("../utils/catchAsync");
const Like = require("../models/ratingModel");
const AppError = require("../utils/appError");

exports.addLike = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;
  if (!postId) {
    return next(new AppError("Post Does not exists"));
  }
  const like = await Like.create({
    like: true,
    post: postId,
    user: req.user,
  });

  res.status(200).json({
    status: "success",
    like,
    message: "Successfully liked the message",
  });
  next();
});

exports.getAllLikes = catchAsync(async (req, res, next) => {
  const likes = await Like.find();

  res.status(200).json({
    status: "success",
    results: likes.length,
    likes,
  });
  next();
});

exports.updateLike = catchAsync(async (req, res, next) => {
  const previousLike = await Like.find({ post: req.params.id });

  console.log(previousLike);
});
