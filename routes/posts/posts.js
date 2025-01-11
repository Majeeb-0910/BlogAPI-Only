import { Router } from "express";
import {
  createPostCtrl,
  deletePostCtrl,
  getPostCtrl,
  getPostsCtrl,
  updatePostCtrl,
} from "../../controllers/posts/posts.js";
import multer from "multer";
import storage from "../../config/cloudinaryConfig.js";

import isLogin from "../../middlewares/isLogin.js";
const postsRoutes = Router();

const upload = multer({ storage });

//* POST/api/v1/posts   ==> creating a post
postsRoutes.post("/", isLogin, upload.single("file"), createPostCtrl);
//* GET/api/v1/posts   ==> fetching all the posts
postsRoutes.get("/", isLogin, getPostsCtrl);
//* GET/api/v1/posts/:id   ==> fetching single post by id of logged in user or different users
postsRoutes.get("/:id", isLogin, getPostCtrl);
//* DELETE/api/v1/posts/:id   ==> deleting single post by id
postsRoutes.delete("/:id", isLogin, deletePostCtrl);
//* PUT/api/v1/posts/:id   ==> Updating single post by id
postsRoutes.put("/:id", isLogin, upload.single("file"), updatePostCtrl);

export default postsRoutes;
