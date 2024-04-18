// configuring .env
import { config } from "dotenv";
config();

// importing needful modules
import express from "express";
import mongoose from "mongoose";

const app = express();

// defining port for server to listen
const PORT = process.env.PORT || 4000;

// Connecting to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Db connected"))
  .catch("Error occured while establishing connect with DB");

// Make server listen 
app.listen(PORT, (req, res) => {
  console.log(`Server listening on port ${PORT}`);
});
