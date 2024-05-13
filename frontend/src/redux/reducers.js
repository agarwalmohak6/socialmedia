import * as actionTypes from "./actionTypes";

const initialState = {
  friends: [],
  posts: [],
  commentsCount: {},
  showComments: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_FRIENDS_SUCCESS:
      return {
        ...state,
        friends: action.friends,
      };
    case actionTypes.FETCH_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.posts,
      };
      case actionTypes.LIKE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.postId ? { ...post, likes: [...post.likes, action.userId] } : post
        ),
      };
    case actionTypes.UNLIKE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.postId ? { ...post, likes: post.likes.filter((userId) => userId !== action.userId) } : post
        ),
      };
    case actionTypes.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        posts: action.posts,
        commentsCount: action.commentsCount,
      };
    case actionTypes.SHOW_COMMENTS_SUCCESS:
      return {
        ...state,
        showComments: action.showComments,
      };
    case actionTypes.FETCH_COMMENTS_COUNT_SUCCESS:
      return {
        ...state,
        commentsCount: action.commentsCount,
      };
    default:
      return state;
  }
};

export default reducer;
