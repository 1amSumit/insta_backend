const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const tokenGen = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find();
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(501).json({
      status: "fail",
      error: error.name,
      message: error.message,
    });
  }
  next();
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      throw new Error("Please enter a email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPasssword(password, user.password))) {
      throw new Error("Inavlid email or password");
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
    next();
  } catch (error) {
    res.status(501).json({
      status: "fail",
      error: error.name,
      message: error.message,
    });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const isEmailAlreadyexist = await User.findOne({ email: req.body.email });
    const isUsernameAlreadyexist = await User.findOne({
      username: req.body.username,
    });

    if (isEmailAlreadyexist) {
      throw new Error("User already exists with ths email");
    }
    if (isUsernameAlreadyexist) {
      throw new Error("User already exists with ths Username");
    }

    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: req.body.role,
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
  } catch (error) {
    res.status(501).json({
      status: "fail",
      error: error.name,
      message: error.message,
    });
  }
  next();
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookie.jwt;
    }
    if (!token) {
      throw new Error("You are not LoggedIn please login.");
    }

    const tokenIsValid = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const freshUser = await User.findById(tokenIsValid.id);

    if (!freshUser) {
      throw new Error("User does not exists.");
    }
    //need to check if user change dpassword sfter login

    req.user = freshUser;
    res.locals.user = freshUser;
    next();
  } catch (error) {
    res.status(501).json({
      status: "fail",
      error: error.name,
      message: error.message,
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const user = await User.findOne({ username: id });
    if (!user) {
      throw new Error("User not found.");
    }
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    res.status(501).json({
      error: error.name,
      message: error.message,
    });
  }
  next();
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.name,
      message: error.message,
    });
  }
};
