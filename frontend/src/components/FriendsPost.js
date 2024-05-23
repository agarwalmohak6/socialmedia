import React from "react";
import { fetchFriendsPost } from "../redux/postActions.js";
import PostList from "./PostList";

const FriendsPost = () => {
  return (
    <div className="posts-page">
      <h1 className="page-title">Friend's Posts</h1>
      <PostList fetchPosts={fetchFriendsPost} />
    </div>
  );
};

export default FriendsPost;
