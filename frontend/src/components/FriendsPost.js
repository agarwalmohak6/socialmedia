import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleLikeHelper from "../helper/handleLikeHelper";
import handleCommentShowHelper from "../helper/handleCommentShowHelper";
import fetchCommentsCountHelper from "../helper/fetchCommentsCountHelper";

const YourPosts = () => {
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [showComments, setShowComments] = useState({});
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

  useEffect(() => {
    fetchCommentsCountHelper(posts, token, setCommentsCount); // Calling the fetchCommentsCountHelper function
  }, [posts, token]);

  const handleLike = (id) => {
    handleLikeHelper(id, token, setPosts, posts);
  };

  const handleAddComment = (postId) => {
    // Logic to handle adding a comment to a post
    console.log("Add comment to post with ID:", postId);
  };

  const handleShowComments = (postId) => {
    handleCommentShowHelper(postId, token, showComments, setShowComments);
  };

  return (
    <div className="posts-page">
      <h1 className="page-title">Your Posts</h1>
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
                  <button
                    className="show-comments-button"
                    onClick={() => handleShowComments(post._id)} // Calling handleShowComments
                  >
                    Show Comments
                  </button>
                </div>
                <div className="post-stats">
                  <p className="likes-count">{post.likes.length} Likes</p>
                  <p className="comments-count">
                    {commentsCount[post._id] || 0} Comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Comments popups for each post */}
        {Object.entries(showComments).map(
          ([postId, comments]) =>
            showComments[postId] && (
              <div key={postId} className="comments-popup">
                <h2>Comments</h2>
                {comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p>{comment.text}</p>
                  </div>
                ))}
                <button
                  className="close-popup"
                  onClick={() =>
                    setShowComments((prevShowComments) => ({
                      ...prevShowComments,
                      [postId]: null,
                    }))
                  }
                >
                  Close
                </button>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default YourPosts;
