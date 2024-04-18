// Importing necessary modules/packages
import express from "express";
import connectDb from "./db/connectDb.js";
import { config } from "dotenv";

// Configuring .env
config();

// Connect to the database
connectDb();

// Initialize Express
const app = express();

// Define port for the server to listen on
const PORT = process.env.PORT || 4000;

// Middleware to handle JSON parsing
app.use(express.json());

// Login Route
app.get("/login", (req, res) => {
  res.send("Login Page");
});

// Register Route
app.get("/register", (req, res) => {
  res.send("Register Page");
});

// Make the server listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
