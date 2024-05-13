// actions.js

import * as actionTypes from "./actionTypes";

export const fetchFriendsSuccess = (friends) => ({
  type: actionTypes.FETCH_FRIENDS_SUCCESS,
  friends,
});

export const fetchPostsSuccess = (posts) => ({
  type: actionTypes.FETCH_POSTS_SUCCESS,
  posts,
});

export const likePostSuccess = (postId, userId) => ({
  type: actionTypes.LIKE_POST_SUCCESS,
  postId,
  userId,
});

export const unlikePostSuccess = (postId, userId) => ({
  type: actionTypes.UNLIKE_POST_SUCCESS,
  postId,
  userId,
});

export const addCommentSuccess = ({ posts, commentsCount }) => ({
  type: actionTypes.ADD_COMMENT_SUCCESS,
  posts,
  commentsCount,
});

export const showCommentsSuccess = (showComments) => ({
  type: actionTypes.SHOW_COMMENTS_SUCCESS,
  showComments,
});

export const fetchCommentsCountSuccess = (commentsCount) => ({
  type: actionTypes.FETCH_COMMENTS_COUNT_SUCCESS,
  commentsCount,
});
