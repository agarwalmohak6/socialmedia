import mongoose from "mongoose";

// Connect to the database
const connectDb = () =>
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Error connecting to the database:", err);
    });

export default connectDb;
