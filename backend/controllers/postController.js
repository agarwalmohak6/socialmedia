import {Post} from "../models/Post.model.js";
import { validatePost } from "../models/Post.model.js";
import {User} from "../models/User.model.js";
import {Reply} from "../models/Reply.model.js";
import { validateReply } from "../models/Reply.model.js";
import StatusCodes from "../utils/statusCodes.js";
import checkPostExist from "../utils/helpers/checkPostExist.js";
import checkUserExist from "../utils/helpers/checkUserExist.js";

const createPost = async (req, res) => {
  try {
    await validatePost(req.body);

    const { postedBy, text, img } = req.body;

    const user = await User.findById(postedBy);
    checkUserExist(user);

    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized to create post" });
    }

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
    checkPostExist(post);
    return res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in getPost", error.message);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    const userId = req.user._id;
    checkPostExist(post);
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
    checkPostExist(post);
    if (post.likes.includes(req.user._id)) {
      await Post.updateOne({ id }, { $pull: { likes: req.user._id } });
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log("Error in likePost", error.message);
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
    checkPostExist(post);

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
    checkPostExist(post);

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
  deletePost,
  likeUnlikePost,
  replyToPost,
  deleteReplyToPost,
};
