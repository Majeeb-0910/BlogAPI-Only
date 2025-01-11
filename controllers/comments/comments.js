import User from "../../model/user/User.js";
import Post from "../../model/post/Post.js";
import Comment from "../../model/comment/Comment.js";
import appErrHandler from "../../utils/appErrorHandler.js";
// ! Create a comment
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    // * Find the post
    const post = await Post.findById(req.params.id);
    // * create the comment
    const comment = await Comment.create({
      user: req.session.userData.id,
      message,
    });
    // * Push the created comment to the Post Model
    post.comments.push(comment._id);
    // * Find the user and push the created comment by the user
    const user = await User.findById(req.session.userData.id);
    user.comments.push(comment._id);
    // * disable validation to save the comment into User model and Post model
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });

    res.json({ status: "success", message: "Comment created" });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};

//! no need
// const getCommentsCtrl = async (req, res) => {
//   try {
//     res.json({
//       status: "success",
//       user: "Comments List ",
//     });
//   } catch (error) {
//     res.json({
//       error,
//     });
//   }
// };

const getCommentCtrl = async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "Comment Details",
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
// ! delete a comment (can delete if comment is owned by a created user)
const deleteCommentCtrl = async (req, res, next) => {
  try {
    //* find the comment
    const commentId = req.params.id;
    const commentFound = await Comment.findById(commentId);
    if (!commentFound) {
      return next(appErrHandler("comment not FOUND"));
    }
    // * check if comment belongs to user
    const user = req.session.userData.id;
    if (commentFound.user.toString() !== user.toString()) {
      return next(appErrHandler("not allowed to delete this comment", 403));
    }
    // * now delete the comment and send the response
    await Comment.findByIdAndDelete(commentId);
    res.json({
      status: "success",
      message: "comment has been deleted",
    });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};
// ! Update a comment (can update if comment is owned by a created user)
const updateCommentCtrl = async (req, res, next) => {
  const { message } = req.body;
  try {
    //* find the comment
    const commentId = req.params.id;
    const commentFound = await Comment.findById(commentId);
    if (!commentFound) {
      return next(appErrHandler("comment not FOUND"));
    }
    // * check if comment belongs to user
    const user = req.session.userData.id;
    if (commentFound.user.toString() !== user.toString()) {
      return next(appErrHandler("not allowed to update this comment", 403));
    }
    // * now delete the comment and send the response
    await Comment.findByIdAndUpdate(commentId, { message }, { new: true });
    res.json({
      status: "success",
      message: "comment has been Updated",
    });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};

export {
  createCommentCtrl,
  // getCommentsCtrl,
  getCommentCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
};
