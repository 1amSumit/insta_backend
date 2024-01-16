const Post = require("../models/postModel");
const multer = require("multer");
const sharp = require("sharp");
const multerStorage = multer.memoryStorage();
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

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

exports.fileSaving = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const fileExtension = req.file.originalname.split(".")[1];

    req.file.filename = `post-${Date.now()}.${fileExtension}`;

    if (req.file.mimetype.startsWith("image")) {
      await sharp(req.file.buffer)
        .resize(500, 500)
        .jpeg({ quality: 90 })
        .toFile(path.join(__dirname, "../public", "posts", req.file.filename));
    }

    if (req.file.mimetype.startsWith("video")) {
      fs.writeFileSync(
        path.join(__dirname, "../public", "posts", req.file.filename),
        req.file.buffer,
        (err) => {
          throw new Error(err);
        }
      );
    }
    let cloudinaryUpload;
    if (fileExtension === "mkv" || fileExtension === "mp4") {
      cloudinaryUpload = await cloudinary.uploader.upload(
        path.join(__dirname, "../public", "posts", req.file.filename),
        {
          resource_type: "video",
          chunk_size: 6000000,
        }
      );
    } else {
      cloudinaryUpload = await cloudinary.uploader.upload(
        path.join(__dirname, "../public", "posts", req.file.filename)
      );
    }

    const post = await Post.create({
      post: cloudinaryUpload.secure_url,
      user: req.user,
      description: req.body.description,
    });

    res.status(200).json({
      status: "success",
      message: "Posted successfully",
      post,
    });

    next();
  } catch (err) {
    res.status(500).json({
      status: "fail",
      err: err,
      message: err.message,
    });
  }
};

exports.postUpload = upload.single("file"); //"file"--> this should b same as in the form submiting name

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user");
    res.status(200).json({
      status: "success",
      results: posts.length,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      err: err,
      message: err.message,
    });
  }
};

exports.getPostOfLoggedInUser = async (req, res, next) => {
  try {
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      erro: error,
      message: err.message,
    });
  }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new Error("No user Found");
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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      erro: error,
      message: err.message,
    });
  }
};
