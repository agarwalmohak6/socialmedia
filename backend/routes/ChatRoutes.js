import express from "express";
import { createChat } from "../controllers/chatController.js";

const router = express.Router();

// Endpoint to create a new chat room
router.post("/create", createChat);

export default router;
