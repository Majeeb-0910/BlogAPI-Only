import dotenv from "dotenv";
import express from "express";
import dbConnect from "./config/dbConnect.js";
import { expressSession } from "./middlewares/expressSession.js";
import globalErrHandler from "./middlewares/globalErrorHandler.js";
dotenv.config();
// ! importing Routes
import commentsRoutes from "./routes/comments/comments.js";
import postsRoutes from "./routes/posts/posts.js";
import userRoutes from "./routes/users/users.js";

const app = express();
const PORT = process.env.PORT || 3000;

dbConnect();
//! middlewares
app.use(express.json()); //middleware to pass incoming json data from the client
app.use(expressSession); //Express-session middleware
// * ---- using Route as middle ware ----
// ? ----------- Users Routes --------------
app.use("/api/v1/users", userRoutes);
// ? ---------- posts Routes ------------
app.use("/api/v1/posts", postsRoutes);
// ? ---------- Comments Routes ----------
app.use("/api/v1/comments", commentsRoutes);

// ! Error Handling middleware
app.use(globalErrHandler);

// * listen SERVER
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
