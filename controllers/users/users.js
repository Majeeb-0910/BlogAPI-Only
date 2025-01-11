import bcrypt from "bcryptjs";
import appErrHandler from "../../utils/appErrorHandler.js";
import User from "../../model/user/User.js";
import { TryCatch } from "../../utils/tryCatch.js";

// !Register
const registerCtrl = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return next(appErrHandler("please enter all the details"));
  }
  try {
    //*  Check if user already registered
    const userFound = await User.findOne({ email });
    // throw an error
    if (userFound) {
      return next(appErrHandler("User already exist"));
    }
    //?(If user not found)
    //* 1.Hash the user password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //* 2. Register the user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    res.json({
      status: "success",
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.json({
      err: error.message,
      stack: "server",
    });
  }
};
// ! Login
const loginCtrl = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(appErrHandler("please enter all the details"));
  }
  try {
    //*  Check if user exits
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return next(appErrHandler("Invalid Email or Password"));
    }
    //* check if password is correct
    const result = await bcrypt.compare(password, userFound.password);
    if (!result) {
      return next(appErrHandler("Invalid Email or Password"));
    }
    // ? save the the user into the session-cookie
    req.session.userData = {
      id: userFound._id,
    };
    res.json({
      status: "success",
      message: "User Login SuccessFull",
      data: userFound,
    });
  } catch (error) {
    res.json({
      error,
      stack: "login Error",
    });
  }
};
//! Logout
const logoutCtrl = TryCatch(async (req, res, next) => {
  req.session.destroy();
  res.json({
    status: "success",
    message: "Logout successful",
  });
});

// ! Profile
const userProfileCtrl = async (req, res, next) => {
  try {
    // * Get the login user id from the session
    const userId = req.session.userData.id;
    // Find the user from the dataBase
    const user = await User.findById(userId)
      .populate("posts")
      .populate("comments");
    res.json({
      status: "success",
      message: "User Details",
      data: user,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
// ! User Details (LoggedIn user uses this to see details of other users)
const userDetailsCtrl = async (req, res, next) => {
  try {
    // * Get the ID of the required user From the params
    const requiredUserId = req.params.id;
    // * Find the required user Details from the DB
    const requiredUser = await User.findById(requiredUserId);
    res.json({
      status: "success",
      message: `Required User Details viewed by ${req.session.userData.id}`,
      data: requiredUser,
    });
  } catch (error) {
    return next(appErrHandler(error.message));
  }
};
//!  Profile image upload
const profilePhotoCtrl = async (req, res, next) => {
  try {
    // * find the user to be updated
    const userId = req.session.userData.id;
    await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file.path },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "profile Updated Successfully",
    });
  } catch (error) {
    return next(appErrHandler(error.message));
  }
};
//!  Cover image upload
const coverPhotoCtrl = async (req, res, next) => {
  try {
    // * find the user to be updated
    const userId = req.session.userData.id;
    await User.findByIdAndUpdate(
      userId,
      { coverImage: req.file.path },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      message: "cover Picture Updated Successfully",
    });
  } catch (error) {
    return next(appErrHandler(error.message));
  }
};
// ! Update User Details
const userUpdateCtrl = async (req, res, next) => {
  const { fullName, email } = req.body; // * fields user can UPDATE
  try {
    //* check if email is already used by other users
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(appErrHandler("Email Already Taken", 400));
      }
    }
    //* update the details provided by the user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        email,
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "User details updated ",
      data: user,
    });
  } catch (error) {
    return next(appErrHandler(error.message));
  }
};
// ! Update user Password
const updatePasswordCtrl = async (req, res, next) => {
  const { oldPassword, password } = req.body;
  if (!password || !oldPassword) {
    return next(appErrHandler("please enter the password"));
  }
  try {
    // * get user id from the session and get hold of hashedPassword from the DB
    const userId = req.session.userData.id;
    const userFound = await User.findById(userId);
    // * check if user's oldPassword is correct
    const result = await bcrypt.compare(oldPassword, userFound.password);
    if (!result) {
      return next(appErrHandler("inValid old Password"));
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "password has been changed successfully",
    });
  } catch (error) {
    return next(appErrHandler(error.message));
  }
};

export {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userDetailsCtrl,
  userProfileCtrl,
  userUpdateCtrl,
  coverPhotoCtrl,
  profilePhotoCtrl,
  updatePasswordCtrl,
};
