import Post from "../models/Post.model.js";
import User from "../models/User.model.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ message: "PostedBy and text fields are mandatory" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to create post" });
    }
    if (text.length > 500) {
      return res
        .status(400)
        .json({ message: "Text length must be less than equal to 500" });
    }
    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    return res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in createPost", error.message);
  }
};

const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error in getPost", error.message);
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    const userId = req.user._id;
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.postedBy.toString() !== userId.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete post" });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error in deletePost", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      await Post.updateOne({ id }, { $pull: { likes: req.user._id } });
      return res.status(201).json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(req.user._id);
      await post.save();
      return res.status(201).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log("Error in likePost", error.message);
  }
};

export { createPost, getPost, deletePost, likeUnlikePost };
