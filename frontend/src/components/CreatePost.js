import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost, fetchPosts } from "../redux/postActions.js";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const CreatePost = ({ onClose }) => {
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmitPost = async () => {
    if (!postText) {
      toast.error("Post text is required");
      return;
    }
    await dispatch(createPost({ text: postText, img: postImage }));
    setPostText("");
    setPostImage("");
    dispatch(fetchPosts());
    navigate("/postsPage");
  };

  return (
    <div className="create-post-form">
      <Toaster />
      <textarea
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Enter your post text"
        required
        className="post-textarea"
      />
      <input
        type="text"
        value={postImage}
        onChange={(e) => setPostImage(e.target.value)}
        placeholder="Enter image URL (optional)"
        className="post-input"
      />
      <button className="submit-post-button" onClick={handleSubmitPost}>
        Create
      </button>
    </div>
  );
};

export default CreatePost;
