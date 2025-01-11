import User from "../../model/user/User.js";
import Post from "../../model/post/Post.js";
import appErrHandler from "../../utils/appErrorHandler.js";
import { v2 as cloudinary } from "cloudinary";

// ! Create Post
const createPostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category || !req.file) {
    return next(appErrHandler("Please Provide All the Fields"));
  }
  try {
    // * find the logged in  User id from the session
    const userId = req.session.userData.id;
    const userFound = await User.findById(userId);
    // * create the post and push it into the array of user's post
    const postCreated = await Post.create({
      title,
      description,
      category,
      image: req.file.path,
      user: userId,
    });
    userFound.posts.push(postCreated._id);
    //* resave the user
    await userFound.save();
    res.json({
      status: "success",
      message: "post Created",
      data: postCreated,
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
// ! Fetch all posts (from different users to display the logged in user)
const getPostsCtrl = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("comments");
    res.json({
      status: "success",
      message: "posts List ",
      data: posts,
    });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};
// ! Fetch a single post
const getPostCtrl = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const postFound = await Post.findById(postId).populate("comments");
    if (!postFound) {
      return next(appErrHandler("Post not FOUND"));
    }
    res.json({
      status: "success",
      message: "post Details",
      data: postFound,
    });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};
// ! Delete the user's own post
const deletePostCtrl = async (req, res, next) => {
  try {
    //* find the post
    const postId = req.params.id;
    const postFound = await Post.findById(postId);
    if (!postFound) {
      return next(appErrHandler("Post not FOUND"));
    }
    // * check if post belongs to login user
    const user = req.session.userData.id;
    if (postFound.user.toString() !== user.toString()) {
      return next(appErrHandler("not allowed to delete this post", 403));
    } 
    // * now delete the post and send the response
    await Post.findByIdAndDelete(postId);
    // * delete the image file from the cloudinary server
    const imageUrl = postFound.image;
    const imageName = imageUrl.split("/")[imageUrl.split("/").length - 1];
    console.log(imageName);
    const image =await cloudinary.uploader.destroy(imageName, (err, result) => {
      if (err) {
        console.log(err);
      }
      return result;
    });
    
    res.json({
      status: "success",
      message: "post has been deleted",
      imageResult: image,
    });
   
  } catch (error) {
    next(appErrHandler(error.message));
  }
};
// ! Update user's own post
const updatePostCtrl = async (req, res, next) => {
  const { title, description, category } = req.body;
  try {
    //* find the post
    const postId = req.params.id;
    const postFound = await Post.findById(postId);
    if (!postFound) {
      return next(appErrHandler("Post not FOUND"));
    }
    // * check if post belongs to login user
    const user = req.session.userData.id;
    if (postFound.user.toString() !== user.toString()) {
      return next(appErrHandler("not allowed to update this post", 403));
    }
    // * now update the post and send the response
    const postUpdate = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        description,
        category,
        image: req.file.path,
      },
      { new: true }
    );
    res.json({
      status: "success",
      message: "post Updated",
      data: postUpdate,
    });
  } catch (error) {
    next(appErrHandler(error.message));
  }
};
export {
  createPostCtrl,
  getPostsCtrl,
  getPostCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
