import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem("token");
const decoded = token ? jwtDecode(token) : {};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
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
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
});

export const fetchFriendsPost = createAsyncThunk(
  "posts/fetchFriendsPost",
  async () => {
    try {
      const friendsResponse = await axios.get(
        `http://localhost:5000/api/users/friends/${decoded.userId}`,
        {
          headers: { Authorization: token },
        }
      );

      const friends = friendsResponse.data.friends || [];
      const postsData = [];

      for (const friend of friends) {
        const response = await axios.get(
          `http://localhost:5000/api/posts/all/${friend.id}`,
          {
            headers: { Authorization: token },
          }
        );
        if (response.data) {
          postsData.push(...response.data);
        }
      }

      return postsData;
    } catch (error) {
      console.error("Error fetching friends' posts:", error);
      throw error;
    }
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async ({ id }) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const url = `http://localhost:5000/api/posts/like/${id}`;
      await axios.post(url, {}, config);

      // Fetch the updated post data after the like/unlike action
      const updatedPostResponse = await axios.get(
        `http://localhost:5000/api/posts/${id}`,
        config
      );

      return updatedPostResponse.data;
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      throw error;
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/posts/allReply/${postId}`,
        config
      );
      return { postId, comments: response.data };
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  }
);

export const fetchCommentsCount = createAsyncThunk(
  "posts/fetchCommentsCount",
  async (posts) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const commentsCounts = {};
      await Promise.all(
        posts.map(async (post) => {
          const response = await axios.get(
            `http://localhost:5000/api/posts/allReply/${post._id}`,
            config
          );
          commentsCounts[post._id] = response.data.length;
        })
      );
      return commentsCounts;
    } catch (error) {
      console.error("Error fetching comments count:", error);
      throw error;
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, commentText }) => {
    try {
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
      return { postId, comment: response.data };
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ text, img }) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/posts/create`,
        { text, img },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }
);
