const mongoose = require("mongoose");

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
    numComments: {
      type: Number,
      default: 0,
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
  this.populate("numComments").populate();
  next();
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
