import { Router } from "express";
import {
  createCommentCtrl,
  deleteCommentCtrl,
  getCommentCtrl,
  // getCommentsCtrl,
  updateCommentCtrl,
} from "../../controllers/comments/comments.js";
import isLogin from "../../middlewares/isLogin.js";

const commentsRoutes = Router();

//* POST/api/v1/comments/:id   ==> creating a comment
commentsRoutes.post("/:id", isLogin, createCommentCtrl);

//* GET/api/v1/comments   ==> fetching all the comments (no need)
// commentsRoutes.get("/", getCommentsCtrl);

//* GET/api/v1/comments/:id   ==> fetching single comment by id
commentsRoutes.get("/:id", getCommentCtrl);

//* DELETE/api/v1/comments/:id   ==> deleting single comment by id
commentsRoutes.delete("/:id", isLogin, deleteCommentCtrl);

//* PUT/api/v1/comments/:id   ==> Updating single comment by id
commentsRoutes.put("/:id", isLogin, updateCommentCtrl);

export default commentsRoutes;
