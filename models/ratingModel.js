const mongoose = require("mongoose");
const User = require("./userModel");
const Post = require("./postModel");

const ratingSchema = new mongoose.Schema(
  {
    like: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Every Comment must have user"],
    },
    post: {
      type: mongoose.Schema.Types.Object,
      ref: "Post",
      required: [true, "Every Comment must have post"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ratingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "user",
    select: "username _id",
  });
  this.populate("post").populate({
    path: "post",
    select: "_id post ",
  });
  next();
});

ratingSchema.statics.calLikes = async function (postId) {
  const numLikes = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: "$post",
        numLikes: { $sum: 1 },
      },
    },
  ]);

  await Post.findByIdAndUpdate(postId, {
    likes: numLikes[0].numLikes,
  });
};
ratingSchema.index({ post: 1, user: 1 }, { unique: true });

ratingSchema.post("save", function () {
  this.constructor.calLikes(this.post);
});

const Like = mongoose.model("Like", ratingSchema);
module.exports = Like;
