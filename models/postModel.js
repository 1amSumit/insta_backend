const mongoose = require("mongoose");
const User = require("../models/userModel");

const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedUser: {
      type: [String],
    },
    comments: {
      type: [
        {
          comment: String,
          username: String,
        },
      ],
      default: [],
    },
    numComments: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Every post have User"],
    },
    username: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "user",
    select: "username profilePic _id",
  });

  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
