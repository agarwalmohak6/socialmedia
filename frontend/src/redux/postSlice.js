// postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const initialState = {
  posts: [],
  like:[],
  comment:[],
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
    return response;
    // if (!response) setPosts([]);
    // else setPosts(response.data.reverse());
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    toggleLike(state, action) {
      const { postId, userId } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        if (post.likes.includes(userId)) {
          post.likes = post.likes.filter((id) => id !== userId);
        } else {
          post.likes.push(userId);
        }
      }
    },
    addComment(state, action) {
      const { postId, comment } = action.payload;
      const post = state.posts.find((post) => post._id === postId);
      if (post) {
        post.comments.push(comment);
      }
    },
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchPosts.fulfilled, (state, action)=>{
        state.posts= action.payload.data
    })
  }
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
