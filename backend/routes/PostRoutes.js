import express from "express";
const router = express.Router();
import protectRoute from "../middlewares/protectRoute.js";
import {
  createPost,
  deletePost,
  deleteReplyToPost,
  getPost,
  getAllPosts,
  likeUnlikePost,
  replyToPost
} from "../controllers/postController.js";

router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.get("/all/:postedBy",getAllPosts);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id",protectRoute, likeUnlikePost);
router.post("/reply/:id",protectRoute, replyToPost);
router.delete("/deleteReply/:id1/:id2",protectRoute, deleteReplyToPost);

export default router;
