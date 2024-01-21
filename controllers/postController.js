const Post = require("../models/postModel");
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
    description: req.body.description,
  });

  res.status(200).json({
    status: "success",
    message: "Posted successfully",
    post,
  });

  next();
});

exports.postUpload = upload.single("file"); //"file"--> this should b same as in the form submiting name

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find().populate("user");
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
  next();
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    return next(new AppError("user not found"));
  }
  const userPosts = await Post.find({
    user: userId,
  }).populate("user");

  res.status(200).json({
    status: "success",
    results: userPosts.length,
    userPosts,
  });
  next();
});
