import {
  ADD_REVIEW_FAIL,
  ADD_REVIEW_REQUEST,
  ADD_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  GET_REVIEW_LIST_FAIL,
  GET_REVIEW_LIST_REQUEST,
  GET_REVIEW_LIST_SUCCESS,
  LIKE_COMMENT_FAIL,
  LIKE_COMMENT_REQUESS,
  LIKE_COMMENT_SUCCESS,
  RESET_REVIEW_MANAGEMENT,
  UPDATE_ACTIVE_REVIEW_FAIL,
  UPDATE_ACTIVE_REVIEW_REQUEST,
  UPDATE_ACTIVE_REVIEW_SUCCESS,
} from "../constants/Review";

const stateDefault = {
  loadingCommentList: null,
  errorCommentList: null,
  commentList: null,

  postReviewObj: "",
  loadingAddReview: false,
  errorAddReview: null,

  successDeleteReview: "",
  loadingDeleteReview: false,
  errorDeleteReview: null,

  likeCommentObj: {},
  loadingLikeComment: false,
  errorLikeComment: null,

  successUpdateActiveReview: "",
  loadingUpdateActiveReview: false,
  errorUpdateActiveReview: null,
};

export const ReviewReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_REVIEW_LIST_REQUEST: {
      return {
        ...state,
        loadingCommentList: true,
        errorCommentList: null,
        commentList: null,
      };
    }
    case GET_REVIEW_LIST_SUCCESS: {
      return {
        ...state,
        commentList: action.payload.data,
        loadingCommentList: false,
      };
    }
    case GET_REVIEW_LIST_FAIL: {
      return {
        ...state,
        errorCommentList: action.payload.error,
        loadingCommentList: false,
      };
    }

    case ADD_REVIEW_REQUEST: {
      return { ...state, loadingAddReview: true, errorAddReview: null };
    }
    case ADD_REVIEW_SUCCESS: {
      return {
        ...state,
        postReviewObj: action.payload.data,
        loadingAddReview: false,
      };
    }
    case ADD_REVIEW_FAIL: {
      return {
        ...state,
        errorAddReview: action.payload.error,
        loadingAddReview: false,
      };
    }

    case DELETE_REVIEW_REQUEST: {
      return {
        ...state,
        loadingDeleteReview: true,
        errorDeleteReview: null,
        successDeleteReview: "",
      };
    }
    case DELETE_REVIEW_SUCCESS: {
      return {
        ...state,
        loadingDeleteReview: false,
        successDeleteReview: action.payload.data,
        errorDeleteReview: null,
      };
    }
    case DELETE_REVIEW_FAIL: {
      return {
        ...state,
        loadingDeleteReview: false,
        errorDeleteReview: action.payload.error,
        successDeleteReview: "",
      };
    }

    case LIKE_COMMENT_REQUESS: {
      return { ...state, loadingLikeComment: true, errorLikeComment: null };
    }
    case LIKE_COMMENT_SUCCESS: {
      return {
        ...state,
        likeCommentObj: action.payload.data,
        loadingLikeComment: false,
      };
    }
    case LIKE_COMMENT_FAIL: {
      return {
        ...state,
        errorLikeComment: action.payload.error,
        loadingLikeComment: false,
      };
    }
    case UPDATE_ACTIVE_REVIEW_REQUEST: {
      return {
        ...state,
        loadingUpdateActiveReview: true,
        errorUpdateActiveReview: null,
        successUpdateActiveReview: "",
      };
    }
    case UPDATE_ACTIVE_REVIEW_SUCCESS: {
      return {
        ...state,
        loadingUpdateActiveReview: false,
        successUpdateActiveReview: action.payload.data,
        errorUpdateActiveReview: null,
      };
    }
    case UPDATE_ACTIVE_REVIEW_FAIL: {
      return {
        ...state,
        loadingUpdateActiveReview: false,
        errorUpdateActiveReview: action.payload.error,
        successUpdateActiveReview: "",
      };
    }
    case RESET_REVIEW_MANAGEMENT: {
      return {
        ...state,
        loadingCommentList: null,
        errorCommentList: null,

        postReviewObj: "",
        loadingAddReview: false,
        errorAddReview: null,

        likeCommentObj: {},
        loadingLikeComment: false,
        errorLikeComment: null,

        successUpdateActiveReview: "",
        loadingUpdateActiveReview: false,
        errorUpdateActiveReview: null,

        successDeleteReview: "",
        loadingDeleteReview: false,
        errorDeleteReview: null,
      };
    }
    default:
      return { ...state };
  }
};
