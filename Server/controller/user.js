const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const { upload } = require("../multer");
const user = require("../model/user");
const path = require("path");
const fs = require("fs");
const sendMail = require("../utils/sendMail");
const { json } = require("body-parser");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
router.post("/create-user", upload.single("file"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      // Delete uploaded file if user exists
      if (req.file) {
        const filename = req.file.filename;
        const filePath = `uploads/${filename}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      return next(new ErrorHandler("User already exists", 500));
    }

    // Check for file upload
    if (!req.file) {
      return next(new ErrorHandler("Please upload a file", 400));
    }

    const filename = req.file.filename;
    const fileUrl = path.join(filename);

    const user = {
      name,
      email,
      password,
      avatar: fileUrl,
    };

    const activationToken = createActivationToken(user);
    const activationUrl = `http://localhost:3000/activation/${activationToken}`;

    try {
      await sendMail({
        email: user.email,
        subject: "Activate Your Account",
        message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,
      });
    } catch (error) {
      // Delete uploaded file if email sending fails
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const createActivationToken = (user) => {
  return jwt.sign(user, process.env.ACTIVATION_SECRET, {
    expiresIn: "5m",
  });
};

//activate user
router.post(
  "/activation",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { activation_token } = req.body;
      console.log("Received token:", activation_token);
      const newUser = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newUser) {
        return next(new ErrorHandler("Invalid Token", 400));
      }
      const { name, email, password, avatar } = newUser;
      let user = await User.findOne({ email });
      if (user) {
        return next(new ErrorHandler("User already exists", 400));
      }
      user = await User.create({
        name,
        email,
        avatar,
        password,
      });
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//login Route
router.post(
  "/login-user",
  catchAsyncErrors(async (req, res, next) => {
    try {
      
      const { email, password } = req.body;
      console.log(email,password)
      if (!email || !password) {
        return next(new ErrorHandler("Please enter all the the fields", 400));
      }
      const user = await User.findOne({ email }.select("+password"));
      if (!user) {
        return next(new ErrorHandler("User Doesn't exit", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(
          new ErrorHandler("Please provide the correct information", 400)
        );
      }
      sendToken(user, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
