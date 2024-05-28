import { ChatRoom } from "../models/Chat.model.js";

const createChat = async (req, res) => {
  try {
    const { roomname } = req.body;
    const newChatRoom = new ChatRoom({ roomname });
    await newChatRoom.save();
    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(500).json({ error: "Error creating chat room" });
  }
};

export { createChat };
