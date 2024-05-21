import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import {
  handleLike,
  fetchCommentsCount,
  fetchFriendsPost,
  fetchComments,
} from "../redux/postSlice";

const FriendsPost = () => {
  const [showComments, setShowComments] = useState({});
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const commentsCount = useSelector((state) => state.posts.commentsCount);
  const comments = useSelector((state) => state.posts.comments);

  useEffect(() => {
    dispatch(fetchFriendsPost());
  }, [dispatch]);

  useEffect(() => {
    if (posts.length) {
      dispatch(fetchCommentsCount(posts));
    }
  }, [dispatch, posts]);

  const handleLikePost = (id, isUnlike = false) => {
    dispatch(handleLike({ id, isUnlike }));
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

  const isPostLikedByUser = (post) => {
    return post.likes.includes(decoded.userId);
  };

  return (
    <div className="posts-page">
      <div className="post-container">
        <h1 className="page-title">Your Posts</h1>
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
                    // onClick={() => handleAddComment(post._id)}
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
        {Object.entries(showComments).map(
          ([postId, isShown]) =>
            isShown && comments[postId] && (
              <div key={postId} className="comments-popup">
                <h2>Comments</h2>
                {comments[postId].map((comment, index) => (
                  <div key={index} className="comment">
                    <p>{comment.text}</p>
                  </div>
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

export default FriendsPost;
