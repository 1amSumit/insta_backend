const Post = require("../models/postModel");
const User = require("../models/userModel");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

cloudinary.config({
  cloud_name: "dijmmmwgd",
  api_key: "877263817944412",
  api_secret: "DLzmVZOuANG9on5dEN4TYGTWLMo",
  secure: true,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video") || file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images and videos", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.fileSaving = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  let result;

  if (req.file.mimetype.startsWith("video")) {
    let uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "foo",
            resource_type: "video",
            chunk_size: 6000000,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
      });
    };
    result = await uploadFromBuffer(req);
  } else {
    let uploadFromBuffer = (req) => {
      return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: "foo",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
      });
    };
    result = await uploadFromBuffer(req);
  }

  const post = await Post.create({
    post: result.secure_url,
    user: req.user,
    username: req.user.username,
    description: req.body.description,
    createdAt: Date.now(),
  });

  await User.findOneAndUpdate(
    { username: req.user.username },
    {
      $push: { posts: post },
      $inc: { numPosts: 1 },
    }
  );

  res.status(200).json({
    status: "success",
    message: "Posted successfully",
    post,
  });
});

exports.postUpload = upload.single("file");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate("user")
    .sort({ createdAt: -1 })
    .exec();
  res.status(200).json({
    status: "success",
    results: posts.length,
    posts,
  });
});

exports.getPostOfLoggedInUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  const userPosts = await Post.find({
    user: user._id,
  }).populate("user");

  res.status(200).json({
    status: "success",
    results: userPosts.length,
    userPosts,
  });
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const username = req.params.user;

  if (!username) {
    return next(new AppError("user not found"));
  }

  const userId = await User.findOne({ username: username });
  const userPosts = await Post.find({
    user: userId,
  }).populate("user");

  res.status(200).json({
    status: "success",
    results: userPosts.length,
    userPosts,
  });
});

exports.getLoggedInUserFeed = catchAsync(async (req, res, next) => {
  const loggedInUser = req.user;
  const followingUsers = loggedInUser.followings;

  const posts = await Post.find({ username: { $in: followingUsers } })
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    status: "success",
    results: posts.length,
    data: {
      posts,
    },
  });
});
