// Importing necessary modules/packages
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
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
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust as needed for security
    methods: ["GET", "POST"],
  },
});

// Define port for the server to listen on
const PORT = process.env.PORT;

// Middlewares -> that run between request and response
app.use(express.json()); // to handle JSON parsing
app.use(express.urlencoded({ extended: true })); // to handle URL-encoded data
app.use(cookieParser()); // to get cookies from req and set cookie in res
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("a user connected");
  // Handle message event from client
  socket.on("message", (data) => {
    console.log("message received: ", data);
    // Broadcast the message to all connected clients
    io.emit("messageResponse", data);
  });
  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`user disconnected: ${reason}`);
  });
});

// Make the server listen
app.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
});
server.listen(4000, () => {
  console.log(`Chat Server is running on port 4000`);
});
