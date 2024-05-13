import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
//import handleLikeHelper from "../helper/handleLikeHelper";
import handleCommentShowHelper from "../helper/handleCommentShowHelper";
import fetchCommentsCountHelper from "../helper/fetchCommentsCountHelper";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../redux/postSlice";

const YourPosts = () => {
  // const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [showComments, setShowComments] = useState({});
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    fetchCommentsCountHelper(posts, token, setCommentsCount);
  }, [posts, token]);

  const handleLike = (id) => {
    //handleLikeHelper(id, token, setPosts, posts);
  };

  const handleAddComment = async (postId) => {
    try {
      const commentText = prompt("Enter your comment:");
      if (!commentText) return;
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/posts/reply/${postId}`,
        { text: commentText },
        config
      );
      //const newComment = response.data;
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) =>
      //     post._id === postId
      //       ? {
      //           ...post,
      //           comments: (post.comments || []).concat(newComment),
      //         }
      //       : post
      //   )
      // );
      setCommentsCount((prevCommentsCount) => ({
        ...prevCommentsCount,
        [postId]: (prevCommentsCount[postId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShowComments = (postId) => {
    handleCommentShowHelper(postId, token, showComments, setShowComments);
  };

  // Function to check if the post is liked by the logged-in user
  const isPostLikedByUser = (post) => {
    return post.likes.includes(decoded.userId);
  };

  console.log(posts);
  return (
    <div className="posts-page">
      <h1 className="page-title">Your Posts</h1>
      <div className="post-container">
        {posts &&
          posts.map((post) => (
            <div key={post._id} className="post">
              {post.img && (
                <img src={post.img} alt="Post" className="post-image" />
              )}
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
                      {isPostLikedByUser(post) ? "Unlike" : "Like"}
                    </button>
                    <button
                      className="comment-button"
                      onClick={() => handleAddComment(post._id)}
                    >
                      Add Comment
                    </button>
                    <button
                      className="show-comments-button"
                      onClick={() => handleShowComments(post._id)}
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
