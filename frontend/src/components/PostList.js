import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { ImCancelCircle } from "react-icons/im";
import {
  handleLike,
  fetchComments,
  addComment,
  fetchCommentsCount,
} from "../redux/postActions.js";

const PostList = ({ fetchPosts }) => {
  const [showComments, setShowComments] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : {};
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const commentsCount = useSelector((state) => state.posts.commentsCount);
  const comments = useSelector((state) => state.posts.comments);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch, fetchPosts]);

  useEffect(() => {
    if (posts.length) {
      dispatch(fetchCommentsCount(posts));
    }
  }, [dispatch, posts]);

  const handleLikePost = (id, isUnlike = false) => {
    dispatch(handleLike({ id, isUnlike }));
  };

  const handleAddComment = async (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText) return;
    await dispatch(addComment({ postId, commentText }));
    dispatch(fetchComments(postId)); // Fetch comments again to update the UI
    setCommentInputs((prevInputs) => ({
      ...prevInputs,
      [postId]: "",
    }));
  };

  const handleCommentInputChange = (postId, text) => {
    setCommentInputs((prevInputs) => ({
      ...prevInputs,
      [postId]: text,
    }));
  };

  const handleShowComments = (postId) => {
    if (showComments !== postId) {
      dispatch(fetchComments(postId));
    }
    setShowComments((prevShowComments) =>
      prevShowComments === postId ? null : postId
    );
  };

  const isPostLikedByUser = (post) => {
    if (!post.likes || !Array.isArray(post.likes)) {
      return false;
    }
    return post.likes.includes(decoded?.userId);
  };

  return (
    <div className="posts-page">
      <h1 className="page-title">Posts</h1>
      <div className="post-container">
        {posts.map((post) => (
          <div key={post._id} className="post">
            {post.img && (
              <img src={post.img} alt="Post" className="post-image" />
            )}
            <div className="post-content">
              <p className="post-text">{post.text}</p>
              <div className="post-details">
                <p className="post-created-at">
                  Created: {moment(post.createdAt).fromNow()}
                </p>
                <p className="post-created-at">Created By: {post.username}</p>
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
                    onClick={() => handleShowComments(post._id)}
                  >
                    {showComments === post._id
                      ? "Hide Comments"
                      : "Show Comments"}
                  </button>
                </div>
                <div className="post-stats">
                  <p className="likes-count">{post.likes?.length || 0} Likes</p>
                  <p className="comments-count">
                    {commentsCount[post._id] || 0} Comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showComments && (
        <div className="comments-side-panel">
          <div className="close-popup">
            <ImCancelCircle onClick={() => setShowComments(null)} />
          </div>
          <h2>
            <u>Comments</u>
          </h2>
          {comments[showComments]?.map((comment, index) => (
            <div key={index} className="comment">
              <h3>{comment.text}</h3>
              <h4>By-{comment.username}</h4>
              <h5>Created: {moment(comment.createdAt).fromNow()}</h5>
            </div>
          ))}
          <div className="add-comment-section">
            <input
              type="text"
              value={commentInputs[showComments] || ""}
              onChange={(e) =>
                handleCommentInputChange(showComments, e.target.value)
              }
              placeholder="Enter your comment"
            />
            <button
              className="add-comment-button"
              onClick={() => handleAddComment(showComments)}
            >
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
