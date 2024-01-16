const mongoose = require("mongoose");
const User = require("./userModel");
const Like = require("./ratingModel");
const Comment = require("./commentModel");

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
    comment: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Comment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Every post have User"],
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
    select: "username profilePic",
  });
  this.populate("comment").populate({
    path: "comment",
    select: "comment post user",
  });
  next();
});

const POST = mongoose.model("POST", postSchema);

module.exports = POST;
