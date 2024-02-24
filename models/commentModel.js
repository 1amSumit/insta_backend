const mongoose = require("mongoose");
const Post = require("./postModel");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
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

commentSchema.pre(/^find/, function (next) {
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

commentSchema.statics.addCommentToPost = async function (postId) {
  const comments = await this.find({ post: postId });
  let arrComments = [];

  comments.map((comment) =>
    arrComments.push({
      comment: comment.comment,
      username: comment.user.username || null,
    })
  );
  await Post.findByIdAndUpdate(postId, {
    comments: arrComments,
  });
};

commentSchema.statics.calNumComments = async function (postId) {
  const numComment = await this.aggregate([
    {
      $match: { post: postId },
    },
    {
      $group: {
        _id: "$post",
        numComment: { $sum: 1 },
      },
    },
  ]);

  await Post.findByIdAndUpdate(postId, {
    numComments: numComment[0].numComment,
  });
};

commentSchema.post("save", async function () {
  await this.constructor.calNumComments(this.post);
  await this.constructor.addCommentToPost(this.post);
});

// commentSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();

//   next();
// });

// commentSchema.post(/^findOne/, async function () {
//   await this.r.constructor.calNumComments(this.r.post);
// });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
