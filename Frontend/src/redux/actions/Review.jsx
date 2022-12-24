import reviewApi from "../../api/reviewApi";
import {
  GET_REVIEW_LIST_REQUEST,
  GET_REVIEW_LIST_SUCCESS,
  GET_REVIEW_LIST_FAIL,
  ADD_REVIEW_REQUEST,
  ADD_REVIEW_SUCCESS,
  ADD_REVIEW_FAIL,
  LIKE_COMMENT_REQUESS,
  LIKE_COMMENT_SUCCESS,
  LIKE_COMMENT_FAIL,
  UPDATE_ACTIVE_REVIEW_REQUEST,
  UPDATE_ACTIVE_REVIEW_SUCCESS,
  UPDATE_ACTIVE_REVIEW_FAIL,
  RESET_REVIEW_MANAGEMENT,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
} from "../constants/Review";

export const getAllReviews = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_REVIEW_LIST_REQUEST,
      });
      const result = await reviewApi.getAllReview();
      dispatch({
        type: GET_REVIEW_LIST_SUCCESS,
        payload: {
          data: result.data.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_REVIEW_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const addReview = (review) => {
  return (dispatch) => {
    dispatch({
      type: ADD_REVIEW_REQUEST,
    });
    reviewApi
      .postReview(review)
      .then((result) => {
        dispatch({
          type: ADD_REVIEW_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ADD_REVIEW_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const likeComment = (id, commentUserLiked) => {
  return (dispatch) => {
    dispatch({
      type: LIKE_COMMENT_REQUESS,
    });
    reviewApi
      .likeComment(id, commentUserLiked)
      .then((result) => {
        dispatch({
          type: LIKE_COMMENT_SUCCESS,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: LIKE_COMMENT_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const updateActiveReview = (active, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ACTIVE_REVIEW_REQUEST,
    });
    reviewApi
      .updateActiveReview(active, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_ACTIVE_REVIEW_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_ACTIVE_REVIEW_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const deleteReview = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_REVIEW_REQUEST,
    });
    reviewApi
      .deleteReview(_id)
      .then((result) => {
        dispatch({
          type: DELETE_REVIEW_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_REVIEW_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};
export const resetReviewManagement = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_REVIEW_MANAGEMENT,
    });
  };
};
