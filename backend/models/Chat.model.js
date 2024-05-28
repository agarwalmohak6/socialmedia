import mongoose from "mongoose";

// Define the ChatRoom schema
const chatRoomSchema = new mongoose.Schema(
  {
    roomname: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the ChatRoom model
const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);

export { ChatRoom };
