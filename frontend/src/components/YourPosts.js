import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  handleLike,
  fetchCommentsCount,
  fetchComments,
  addComment,
  createPost,
} from "../redux/postActions.js";

const YourPosts = () => {
  const [showComments, setShowComments] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  console.log(decoded)
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const commentsCount = useSelector((state) => state.posts.commentsCount);
  const comments = useSelector((state) => state.posts.comments);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length) {
      dispatch(fetchCommentsCount(posts));
    }
  }, [dispatch, posts]);

  const handleLikePost = (id, isUnlike = false) => {
    dispatch(handleLike({ id, isUnlike }));
  };

  const handleAddComment = async (postId) => {
    const commentText = prompt("Enter your comment:");
    if (!commentText) return;
    dispatch(addComment({ postId, commentText }));
  };

  const handleShowComments = (postId) => {
    if (!showComments[postId]) {
      dispatch(fetchComments(postId));
    }
    setShowComments((prevShowComments) => ({
      ...prevShowComments,
      [postId]: !prevShowComments[postId],
    }));
  };

  const handleCreatePost = () => {
    setShowCreatePost(true);
  };

  const handleSubmitPost = async () => {
    if (!postText) {
      alert("Post text is required");
      return;
    }
    await dispatch(createPost({ text: postText, img: postImage }));
    setShowCreatePost(false);
    setPostText("");
    setPostImage("");
    dispatch(fetchPosts());
  };

  const isPostLikedByUser = (post) => {
    return post.likes && post.likes.includes(decoded.userId);
  };

  return (
    <div className="posts-page">
      <div className="post-container">
        <h1 className="page-title">Your Posts</h1>
        <button className="create-post-button" onClick={handleCreatePost}>
          Create Post
        </button>

        {showCreatePost && (
          <div className="create-post-form">
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
            <button
              className="submit-close-button"
              onClick={() => setShowCreatePost(false)}
            >
              Close
            </button>
          </div>
        )}
        {posts.map((post) => (
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
                  {isPostLikedByUser(post) ? (
                    <button
                      className="like-button"
                      onClick={() => handleLikePost(post._id, true)}
                    >
                      Unlike
                    </button>
                  ) : (
                    <button
                      className="like-button"
                      onClick={() => handleLikePost(post._id)}
                    >
                      Like
                    </button>
                  )}
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
                  <p className="likes-count">
                    {post.likes ? post.likes.length : 0} Likes
                  </p>
                  <p className="comments-count">
                    {commentsCount[post._id] || 0} Comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {Object.entries(showComments).map(
          ([postId, isShown]) =>
            isShown &&
            comments[postId] && (
              <div key={postId} className="comments-popup">
                <h2>Comments</h2>
                {comments[postId].map((comment) => (
                  <p key={comment._id}>{comment.text}</p>
                ))}
                <button
                  className="close-popup"
                  onClick={() =>
                    setShowComments((prevShowComments) => ({
                      ...prevShowComments,
                      [postId]: false,
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
