import Post from "../models/Post.model.js";
import User from "../models/User.model.js";
import StatusCodes from "../utils/statusCodes.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    if (!postedBy || !text) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "PostedBy and text fields are mandatory" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized to create post" });
    }
    if (text.length > 500) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Text length must be less than equal to 500" });
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
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
    return res.status(StatusCodes.CREATED).json(post);
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
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
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
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }

    if (post.likes.includes(req.user._id)) {
      await Post.updateOne({ id }, { $pull: { likes: req.user._id } });
      return res
        .status(StatusCodes.CREATED)
        .json({ message: "Post unliked successfully" });
    } else {
      post.likes.push(req.user._id);
      await Post.save();
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
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "Text is required to post" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post does not exist" });
    }
    const reply = { userId, text, userProfilePic, username };
    post.replies.push(reply);
    await post.save();
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
    if (!post) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Post not found" });
    }
    const replyIndex = post.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    if (replyIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Reply not found" });
    }
    post.replies.splice(replyIndex, 1);
    await post.save();
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
