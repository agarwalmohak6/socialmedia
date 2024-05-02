import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const FriendsPost = () => {
  const [friends, setFriends] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token missing in frontend");
      return;
    }
    const decoded = jwtDecode(token);

    const fetchData = async () => {
      try {
        const friendsResponse = await axios.get(
          `http://localhost:5000/api/users/friends/${decoded.userId}`
        );
        if (!friendsResponse.data) {
          setFriends([]);
        } else {
          setFriends(friendsResponse.data.friends); // Set friends array
        }

        const postsData = [];
        for (const friend of friendsResponse.data.friends) {
          // console.log(friend.id);
          const response = await axios.get(
            `http://localhost:5000/api/posts/all/${friend.id}`
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
  }, []);
  const handleLike = (postId) => {
    // Logic to handle liking a post
    console.log("Liked post with ID:", postId);
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

export default FriendsPost;
