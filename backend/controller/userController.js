const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { builtinModules } = require("module");
const cloudinary = require("cloudinary");
//Register a User

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop : "scale",
       })
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  console.log("before creating user");
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

//login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and Password ", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new ErrorHandler("Invalid email or Password ", 401));
  }

  //const isPasswordMatched = user.comparePassword(password);
  /////  console.log("before");
  //  console.log(`ismatchedis${isPasswordMatched}`);
  //  console.log("after");
  // if (!isPasswordMatched) {
  console.log(password);
  console.log(user.password);
  if (password != user.password) {
    console.log("password not matched");
    return next(new ErrorHandler("Invalid email or Password ", 401));
  }

  sendToken(user, 200, res);
});

// Logout user

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();
  console.log("Inside forgot password:-")
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n\n${resetPasswordUrl} \n\n If you have not requested this email then , please ignore it`;
  try {
    await sendEmail({
      email: user.email,
      subject: `Grocery Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfullly`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset the password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  console.log("before user");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log("after user");
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or hash is expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 404));
  }
  // user.password = req.body.password;
  user.password = req.body.confirmPassword;
  user.resetPasswordToken = undefined;

  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

//Get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

//Update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  // const { email, password } = req.body;
  const user = await User.findById(req.user.id).select("+password");
  if (req.body.oldPassword !== user.password) {
    // compare password function to compare between them

    return next(new ErrorHandler("Invalid old Password ", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    // compare password function to compare between them

    return next(new ErrorHandler("Password does not matched ", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

//Update user Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // const { email, password } = req.body;
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
   
  };
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop : "scale",
      })

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
     
   }

  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users   --- for admin only
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

// Get  single users details --- for admin only
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id} `, 401)
    );
  }
  res.status(200).json({
    user,
  });
});

// Updating user role by the --admin only
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role : req.body.role,  
  };
  // params.id is used to update the selected users role not the role of admin itself
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true, 
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete the User  --admin only
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
 
  const user = await User.findById(req.params.id);
  

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with id: ${req.params.id} `, 401)
    );
  }
  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);
  await user.remove();
  res.status(200).json({
    success: true,
    message:"User deleted successfullly",
  });
});
