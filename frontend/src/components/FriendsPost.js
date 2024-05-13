import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import handleLikeHelper from "../helper/handleLikeHelper";
import handleCommentShowHelper from "../helper/handleCommentShowHelper";
import fetchCommentsCountHelper from "../helper/fetchCommentsCountHelper";

const FriendsPost = () => {
  const [, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);
  const [commentsCount, setCommentsCount] = useState({});
  const [showComments, setShowComments] = useState({});
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);

  useEffect(() => {
    if (!token) {
      console.log("Token missing in frontend");
      return;
    }

    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get(
          `http://localhost:5000/api/users/friends/${decoded.userId}`,
          { headers: { Authorization: token } }
        );
        if (!friendsResponse.data) {
          setFriends([]);
        } else {
          setFriends(friendsResponse.data.friends); // Set friends array
        }

        const postsData = [];
        for (const friend of friendsResponse.data.friends) {
          const response = await axios.get(
            `http://localhost:5000/api/posts/all/${friend.id}`,
            { headers: { Authorization: token } }
          );
          if (response.data) {
            postsData.push(...response.data);
          }
        }
        setPosts(postsData.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [decoded.userId, token]);

  useEffect(() => {
    fetchCommentsCountHelper(posts, token, setCommentsCount);
  }, [posts, token]);

  const handleLike = (id) => {
    handleLikeHelper(id, token, setPosts, posts);
  };

  const handleUnlike = (id) => {
    handleLikeHelper(id, token, setPosts, posts, true);
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

      const newComment = response.data;
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: (post.comments || []).concat(newComment),
              }
            : post
        )
      );
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

  const isPostLikedByUser = (post) => {
    return post.likes.includes(decoded.userId);
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
                {isPostLikedByUser(post) ? (
                  <button
                    className="like-button"
                    onClick={() => handleUnlike(post._id)}
                  >
                    Unlike
                  </button>
                ) : (
                  <button
                    className="like-button"
                    onClick={() => handleLike(post._id)}
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
                <p className="likes-count">{post.likes.length} Likes</p>
                <p className="comments-count">
                  {commentsCount[post._id] || 0} Comments
                </p>
              </div>
            </div>
          </div>
          {/* Comments popup for the post */}
          {showComments[post._id] && (
            <div className="comments-popup">
              <h2>Comments</h2>
              {showComments[post._id].map((comment, index) => (
                <div key={index} className="comment">
                  <p>{comment.text}</p>
                </div>
              ))}
              <button
                className="close-popup"
                onClick={() =>
                  setShowComments((prevShowComments) => ({
                    ...prevShowComments,
                    [post._id]: null,
                  }))
                }
              >
                Close
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FriendsPost;
