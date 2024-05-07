import { Post } from "../models/Post.model.js";
import { validatePost } from "../models/Post.model.js";
import { Reply } from "../models/Reply.model.js";
import { validateReply } from "../models/Reply.model.js";
import StatusCodes from "../utils/statusCodes.js";
import checkPostExist from "../utils/helpers/checkPostExist.js";

const createPost = async (req, res) => {
  try {
    await validatePost(req.body);
    const { text, img } = req.body;
    const postedBy = req.user._id.toString();
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Post created successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in createPost", error.message);
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    checkPostExist(post, res);
    return res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in getPost", error.message);
  }
};

const getAllPosts = async (req, res) => {
  const { postedBy } = req.params;
  try {
    const posts = await Post.find({ postedBy });
    checkPostExist(posts, res);
    return res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in getAllPosts", error.message);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    const userId = req.user._id;
    checkPostExist(post, res);
    if (post.postedBy.toString() !== userId.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized to delete post" });
    }
    await Post.findByIdAndDelete(id);
    res
      .status(StatusCodes.NO_CONTENT)
      .json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in deletePost", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    checkPostExist(post, res);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // If the user already liked the post, unlike it
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
      const updatedPost = await Post.findById(id);
      const likeCount = updatedPost.likes.length;
      return res
        .status(StatusCodes.OK)
        .json({ message: "Post unliked successfully", likeCount });
    } else {
      // If the user hasn't liked the post, like it
      post.likes.push(userId);
      await post.save();
      const updatedPost = await Post.findById(id);
      const likeCount = updatedPost.likes.length;
      return res
        .status(StatusCodes.OK)
        .json({ message: "Post liked successfully", likeCount });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in likeUnlikePost", error.message);
  }
};



const replyToPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    // Validating the reply data
    await validateReply(req.body);

    const post = await Post.findById(postId);
    checkPostExist(post, res);

    const reply = new Reply({ userId, text });
    await reply.save();

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Reply added successfully", post });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in replyToPost", error.message);
  }
};

const deleteReplyToPost = async (req, res) => {
  try {
    const postId = req.params.id1;
    const replyId = req.params.id2;

    const post = await Post.findById(postId);
    checkPostExist(post, res);

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Reply not found" });
    }
    await Reply.findByIdAndDelete(replyId);

    res.status(StatusCodes.OK).json({ message: "Reply deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.NO_CONTENT).json({ message: error.message });
    console.log("Error in deleteReplyTopost", error.message);
  }
};

export {
  createPost,
  getPost,
  getAllPosts,
  deletePost,
  likeUnlikePost,
  replyToPost,
  deleteReplyToPost,
};
