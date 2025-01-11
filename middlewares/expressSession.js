import dotenv from "dotenv";
dotenv.config();
import session from "express-session";
import MongoStore from "connect-mongo";

export const expressSession = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 6,
  },
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URL,
    ttl: 1000 * 60 * 60 * 6, // expires in 6 hrs
  }),
});
