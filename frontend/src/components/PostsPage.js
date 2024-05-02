import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import YourPosts from "./YourPosts";
import FriendsPost from "./FriendsPost";

const PostsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  return (
    <div className="posts-page">
      <h1 className="page-title">Posts</h1>
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Your Posts" />
        <Tab label="Friend's Posts" />
      </Tabs>
      {tabValue === 0 && <YourPosts />}
      {tabValue === 1 && <FriendsPost />}
    </div>
  );
};

export default PostsPage;
