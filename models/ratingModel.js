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
      type: mongoose.Schema.Types.ObjectId,
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

ratingSchema.statics.addLikeToPost = async function (postId) {
  const likes = await this.find({ post: postId });
  let likeArr = [];
  likes.map((like) => likeArr.push(like.user.username));
  await Post.findByIdAndUpdate(postId, {
    likedUser: likeArr,
  });
};

ratingSchema.statics.calLikes = async function (postId) {
  const numLikes = await this.aggregate([
    {
      $match: { post: postId, like: true },
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

ratingSchema.post("save", async function () {
  await this.constructor.calLikes(this.post);
  await this.constructor.addLikeToPost(this.post);
});

const Like = mongoose.model("Like", ratingSchema);
module.exports = Like;
