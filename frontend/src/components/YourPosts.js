import React from "react";
import { fetchPosts } from "../redux/postActions.js";
import PostList from "./PostList";

const YourPosts = () => {
  return (
    <div className="posts-page">
      <h1 className="page-title">Your Posts</h1>
      <PostList fetchPosts={fetchPosts} />
    </div>
  );
};

export default YourPosts;
