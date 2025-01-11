import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongoURL = process.env.MONGO_URL;
const dbConnect = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection FAILED", error.message);
  }
};

export default dbConnect;
