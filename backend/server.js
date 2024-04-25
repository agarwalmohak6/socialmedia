// Importing necessary modules/packages
import express from "express";
import connectDb from "./db/connectDb.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import cors from "cors";

// Configuring .env
config();

// Connect to the database
connectDb();

// Initialize Express
const app = express();

// Define port for the server to listen on
const PORT = process.env.PORT || 4000;

// Middlewares -> that runs between request and response
app.use(express.json()); // to handle JSON parsing
app.use(express.urlencoded({ extended: true })); // to handle JSON parsing
app.use(cookieParser()); // to get cookies from req and set cookie in res
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Make the server listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
