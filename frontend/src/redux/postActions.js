import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../helper/axiosInstance";
import { getDecodedval } from "../helper/userHelper";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const decoded= getDecodedval();
    const response = await axiosInstance.get(`/posts/all/${decoded?.userId}`);
    return response.data.reverse();
  } catch (error) {
    console.log("Error fetching posts:", error);
    throw error;
  }
});

export const fetchFriendsPost = createAsyncThunk(
  "posts/fetchFriendsPost",
  async () => {
    try {
      const decoded= getDecodedval();
      const friendsResponse = await axiosInstance.get(
        `/users/friends/${decoded.userId}`
      );

      const friends = friendsResponse.data.friends || [];
      const postsData = [];

      for (const friend of friends) {
        const response = await axiosInstance.get(`/posts/all/${friend.id}`);
        if (response.data) {
          postsData.push(...response.data.reverse());
        }
      }

      return postsData;
    } catch (error) {
      console.log("Error fetching friends' posts:", error);
      throw error;
    }
  }
);

export const handleLike = createAsyncThunk(
  "posts/handleLike",
  async ({ id }) => {
    try {
      await axiosInstance.post(`/posts/like/${id}`);
      // Fetch the updated post data after the like/unlike action
      const updatedPostResponse = await axiosInstance.get(`/posts/${id}`);

      return updatedPostResponse.data;
    } catch (error) {
      console.log("Error liking/unliking post:", error);
      throw error;
    }
  }
);

export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postId) => {
    try {
      const response = await axiosInstance.get(`/posts/allReply/${postId}`);
      return { postId, comments: response.data };
    } catch (error) {
      console.log("Error fetching replies:", error);
      throw error;
    }
  }
);

export const fetchCommentsCount = createAsyncThunk(
  "posts/fetchCommentsCount",
  async (posts) => {
    try {
      const commentsCounts = {};
      await Promise.all(
        posts.map(async (post) => {
          const response = await axiosInstance.get(
            `/posts/allReply/${post._id}`
          );
          commentsCounts[post._id] = response.data.length;
        })
      );
      return commentsCounts;
    } catch (error) {
      console.log("Error fetching comments count:", error);
      throw error;
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, commentText }) => {
    try {
      const response = await axiosInstance.post(`/posts/reply/${postId}`, {
        text: commentText,
      });
      return { postId, comment: response.data };
    } catch (error) {
      console.log("Error adding comment:", error);
      throw error;
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ text, img }) => {
    try {
      const response = await axiosInstance.post(`/posts/create`, { text, img });
      return response.data;
    } catch (error) {
      console.log("Error creating post:", error);
      throw error;
    }
  }
);
