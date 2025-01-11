import appErrHandler from "../utils/appErrorHandler.js";
import { TryCatch } from "../utils/tryCatch.js";

const isLogin = (req, res, next) => {
  // check if user is logged in
  if (req.session.userData) {
    next();
  } else {
    next(appErrHandler("Please login to continue", 200));
  }
};

export const isLoginMod = TryCatch((req, res, next) => {
  // check if user is logged in
  if (req.session.userData) {
    next();
  } else {
    next(appErrHandler("Please login to continue", 200));
  }
});

export default isLogin;
