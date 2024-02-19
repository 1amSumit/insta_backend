const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "User must have user name."],
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have email."],
    lowercase: true,
    validate: [validator.isEmail, "Please provide your email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profilePic: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
  },

  numFollowers: {
    type: Number,
    default: 0,
  },

  numFollowings: {
    type: Number,
    default: 0,
  },

  followers: {
    type: [mongoose.Schema.Types.ObjectId],
  },

  followings: {
    type: [mongoose.Schema.Types.ObjectId],
  },

  requests: {
    type: [mongoose.Schema.Types.ObjectId],
  },
  numRequests: {
    type: Number,
    default: 0,
  },

  requested: {
    type: [mongoose.Schema.Types.ObjectId],
  },

  numRequested: {
    type: Number,
    default: 0,
  },

  numPosts: {
    type: Number,
    default: 0,
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
  },

  password: {
    type: String,
    required: [true, "Please provide your password"],
    select: false,
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    require: [true, "Please provide the confirm password"],
    validte: {
      validator: function (confpass) {
        return confpass === this.password;
      },
      message: "Confirm password is not same",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPasssword = async function (
  userPassword,
  passwordStored
) {
  return await bcrypt.compare(userPassword, passwordStored);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
