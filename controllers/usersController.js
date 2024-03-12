const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const tokenGen = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: user,
  });
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Please provide your correct email and password"));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPasssword(password, user.password))) {
    return next(new AppError("Invalid email or password"));
  }

  const token = tokenGen(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const isEmailAlreadyexist = await User.findOne({ email: req.body.email });
  const isUsernameAlreadyexist = await User.findOne({
    username: req.body.username,
  });

  if (isEmailAlreadyexist) {
    return next(new AppError("User already exists with ths email"));
  }
  if (isUsernameAlreadyexist) {
    return next(new AppError("User already exists with ths Username"));
  }

  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
    createdAt: Date.now(),
  });

  const token = tokenGen(newUser._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not LoggedIn please login."));
  }

  const tokenIsValid = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const freshUser = await User.findById(tokenIsValid.id);

  if (!freshUser) {
    return next(new AppError("User does not exists."));
  }
  //need to check if user change dpassword sfter login

  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const id = req.params.userId;
  const user = await User.findOne({ username: id });
  if (!user) {
    return next(new Error("User not found."));
  }
  res.status(200).json({
    status: "success",
    user,
  });

  next();
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.userId);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
  next();
});

exports.getUserByUserName = catchAsync(async (req, res, next) => {
  const username = req.params.username;
  const userProfile = await User.findOne({ username: username }).select(
    "username profilePic numFollowers numFollowings  followings followers numPosts posts requestRec requestSent numRequestSent numRequestedRec"
  );
  if (!userProfile) {
    return next("User not found with this username.");
  }

  res.status(200).json({
    status: "success",
    userProfile: userProfile,
  });
});

exports.searchUserByName = catchAsync(async (req, res, next) => {
  const name = req.query.name;

  const regex = new RegExp(`${name}`, "i");
  const userData = await User.find({ username: regex }).select(
    "username profilePic"
  );
  res.status(200).json({
    status: "success",
    result: userData.length,
    data: {
      userData,
    },
  });
});

exports.followUser = catchAsync(async (req, res, next) => {});
