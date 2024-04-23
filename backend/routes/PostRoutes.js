import express from "express";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import { createPost, getPost } from "../controllers/postController.js";

router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);

export default router;
