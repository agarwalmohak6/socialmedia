// postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const initialState = {
  posts: [],
  comments: {},
  commentsCount: {},
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("fetchPosts", async () => {
  try {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
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
  "fetchFriendsPost",
  async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
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
  }
);

export const handleLike = createAsyncThunk("handleLike", async ({ id }) => {
  try {
    const token = localStorage.getItem("token");
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
});

export const fetchComments = createAsyncThunk("posts/fetchComments", async (postId) => {
  try {
    const token = localStorage.getItem("token");
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
});


export const fetchCommentsCount = createAsyncThunk(
  "fetchCommentsCount",
  async (posts) => {
    try {
      const token = localStorage.getItem("token");
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

const postSlice = createSlice({
  name: "posts",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(fetchFriendsPost.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })
      .addCase(handleLike.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        const postIndex = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (postIndex >= 0) {
          state.posts[postIndex] = updatedPost;
        }
      })
      .addCase(fetchCommentsCount.fulfilled, (state, action) => {
        state.commentsCount = action.payload;
      });
  },
});

export const {
  setPosts,
  setLoading,
  setError,
  addPost,
  toggleLike,
  addComment,
} = postSlice.actions;
export default postSlice.reducer;
