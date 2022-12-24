import moviesApi from "../../api/moviesApi";
import {
  ADD_MOVIE_FAIL,
  ADD_MOVIE_REQUEST,
  ADD_MOVIE_SUCCESS,
  DELETE_MOVIE_FAIL,
  DELETE_MOVIE_REQUEST,
  DELETE_MOVIE_SUCCESS,
  GET_MOVIE_FAIL,
  GET_MOVIE_LIST_FAIL,
  GET_MOVIE_LIST_REQUEST,
  GET_MOVIE_LIST_SUCCESS,
  GET_MOVIE_REQUEST,
  GET_MOVIE_SUCCESS,
  RESET_MOVIE_MANAGEMENT,
  UPDATE_MOVIE_FAIL,
  UPDATE_MOVIE_REQUEST,
  UPDATE_MOVIE_SUCCESS,
} from "../constants/Movie";

export const getMovieList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_MOVIE_LIST_REQUEST,
      });
      const result = await moviesApi.getMoviesList();
      dispatch({
        type: GET_MOVIE_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_MOVIE_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const deleteMovie = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_MOVIE_REQUEST,
    });
    moviesApi
      .deleteMovie(_id)
      .then((result) => {
        dispatch({
          type: DELETE_MOVIE_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_MOVIE_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const updateMovie = (movie, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_MOVIE_REQUEST,
    });
    moviesApi
      .updateMovie(movie, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_MOVIE_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_MOVIE_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const getDetailMovie = (_id) => {
  return (dispatch) => {
    dispatch({
      type: GET_MOVIE_REQUEST,
    });
    moviesApi
      .getDetailMovie(_id)
      .then((result) => {
        dispatch({
          type: GET_MOVIE_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_MOVIE_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const addMovieUploadImg = (movie) => {
  return (dispatch) => {
    dispatch({
      type: ADD_MOVIE_REQUEST,
    });
    moviesApi
      .addMovieUploadImg(movie)
      .then((result) => {
        dispatch({
          type: ADD_MOVIE_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: ADD_MOVIE_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const resetMoviesManagement = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_MOVIE_MANAGEMENT,
    });
  };
};
