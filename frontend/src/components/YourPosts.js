import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleLikeHelper from "../helper/handleLikeHelper";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const config = {
          headers: {
            Authorization: token,
          },
        };
        const response = await axios.get(
          `http://localhost:5000/api/posts/all/${decoded.userId}`,
          config
        );
        if (!response) setPosts([]);
        else setPosts(response.data.reverse());
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [decoded.userId, token]);

  const handleLike = (id) => {
    handleLikeHelper(id, token, setPosts, posts);
  };

  const handleAddComment = (postId) => {
    // Logic to handle adding a comment to a post
    console.log("Add comment to post with ID:", postId);
  };

  return (
    <div className="post-container">
      {posts.map((post) => (
        <div key={post._id} className="post">
          <img src={post.img} alt="Post" className="post-image" />
          <div className="post-content">
            <p className="post-text">{post.text}</p>
            <div className="post-details">
              <p className="post-created-at">
                Created At: {new Date(post.createdAt).toLocaleString()}
              </p>
              <div className="post-actions">
                <button
                  className="like-button"
                  onClick={() => handleLike(post._id)}
                >
                  Like
                </button>
                <button
                  className="comment-button"
                  onClick={() => handleAddComment(post._id)}
                >
                  Add Comment
                </button>
              </div>
              <div className="post-stats">
                <p className="likes-count">{post.likes.length} Likes</p>
                <p className="comments-count">
                  {post.comments?.length || 0} Comments
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default YourPosts;
