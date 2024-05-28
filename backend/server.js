import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDb from "./db/connectDb.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/UserRoutes.js";
import postRoutes from "./routes/PostRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js"
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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Define port for the server to listen on
const PORT = process.env.PORT;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chatRooms", chatRoutes);

// Socket.io connection and events begin
io.on("connection", (socket) => {
  console.log("a user connected");
  // Handle room joining
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    socket.to(room).emit("userJoinedRoom", room);
  });
  // Handle room leaving
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
    socket.to(room).emit("userLeftRoom", room);
  });
  // Handle message event from client
  socket.on("message", ({ room, message }) => {
    console.log(`message received${room ? ` in room ${room}` : ""}: `, message);
    if (room) {
      io.to(room).emit("messageResponse", message); // send message to room
    } else {
      io.emit("messageResponse", message); // if no room found, then broadcast
    }
  });
  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`user disconnected: ${reason}`);
  });
});
// Socket.io connection and events closed

// Make the server listen
app.listen(PORT, () => {
  console.log(`App Server is running on port ${PORT}`);
});
server.listen(4000, () => {
  console.log(`Chat Server is running on port 4000`);
});
