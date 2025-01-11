import { Router } from "express";
import storage from "../../config/cloudinaryConfig.js";
import multer from "multer";
import {
  registerCtrl,
  loginCtrl,
  logoutCtrl,
  userUpdateCtrl,
  userDetailsCtrl,
  coverPhotoCtrl,
  userProfileCtrl,
  profilePhotoCtrl,
  updatePasswordCtrl,
} from "../../controllers/users/users.js";
import isLogin, { isLoginMod } from "../../middlewares/isLogin.js";

const userRoutes = Router();
// ! instance of multer
const upload = multer({ storage }); //pass this as a middleware where file upload is required

//* POST/api/v1/users/register
userRoutes.post("/register", registerCtrl);
//* POST/api/v1/users/login
userRoutes.post("/login", loginCtrl);
//* GET/api/v1/users/logout
userRoutes.get("/logout", isLoginMod, logoutCtrl);

//* GET/api/v1/users/profile
userRoutes.get("/profile", isLogin, userProfileCtrl);

//* PUT/api/v1/users/profile-photo-upload/:id (Upload & Update)
userRoutes.put(
  "/profile-photo-upload",
  isLogin,
  upload.single("profile"),
  profilePhotoCtrl
);
//* PUT/api/v1/users/cover-photo-upload/:id (Upload & Update)
userRoutes.put(
  "/cover-photo-upload",
  isLogin,
  upload.single("cover"),
  coverPhotoCtrl
);

//* PUT/api/v1/users/update/:id (Update)
userRoutes.put("/update/:id", isLogin, userUpdateCtrl);
//* PUT/api/v1/users/update-password/:id (Update password)
userRoutes.put("/update-password", isLogin, updatePasswordCtrl);

//* GET/api/v1/users/:id
userRoutes.get("/:id", isLogin, userDetailsCtrl);

export default userRoutes;
