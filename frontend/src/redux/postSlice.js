import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPosts,
  fetchFriendsPost,
  handleLike,
  fetchComments,
  fetchCommentsCount,
  addComment,
  createPost,
} from "./postActions.js";

const initialState = {
  posts: [],
  comments: {},
  commentsCount: {},
  loading: false,
  error: null,
};

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
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].push(comment);
        state.commentsCount[postId] = (state.commentsCount[postId] || 0) + 1;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      });
  },
});

export default postSlice.reducer;
