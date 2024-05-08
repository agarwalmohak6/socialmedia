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
  replyToPost,
  getAllReplies
} from "../controllers/postController.js";

router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.get("/all/:postedBy",protectRoute,getAllPosts);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id",protectRoute, likeUnlikePost);
router.post("/reply/:id",protectRoute, replyToPost);
router.delete("/deleteReply/:id1/:id2",protectRoute, deleteReplyToPost);
router.get("/allReply/:id",protectRoute,getAllReplies);

export default router;
