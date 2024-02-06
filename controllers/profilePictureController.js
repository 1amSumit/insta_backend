const User = require("../models/userModel");
const multer = require("multer");
const AppError = require("../utils/appError");
const multerStorage = multer.memoryStorage();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dijmmmwgd",
  api_key: "877263817944412",
  api_secret: "DLzmVZOuANG9on5dEN4TYGTWLMo",
  secure: true,
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadProfilePicture = catchAsync(async (req, res, next) => {
  const username = req.parmas.username;
  if (!req.file) {
    return next();
  }

  const user = await User.findOne({ username });
  if (!user) {
    return next(new AppError("User not found with this username."));
  }

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

  const profilePic = await User.findByIdAndUpdate({
    profilePic: result.secure_url,
  });

  res.status(200).json({
    status: "success",
    message: "Profil pic uploaded successfully",
    profilePic,
  });
});

exports.uploadProfilePic = upload.single("file");
