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
  RESET_MOVIE_DETAIL,
  RESET_MOVIE_MANAGEMENT,
  UPDATE_MOVIE_FAIL,
  UPDATE_MOVIE_REQUEST,
  UPDATE_MOVIE_SUCCESS,
} from "../constants/Movie";

const stateDefault = {
  movieList: [],
  loadingMovieList: false,
  errorMovieList: null,
  movieDetail: null,

  successDetailMovie: "",
  loadingDetailMovie: false,
  errorDetailMovie: null,

  successDeleteMovie: "",
  loadingDeleteMovie: false,
  errorDeleteMovie: null,

  successUpdateMovie: "",
  loadingUpdateMovie: false,
  errorUpdateMovie: null,

  successAddMovie: "",
  loadingAddMovie: false,
  errorAddMovie: null,
};

export const MovieReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_MOVIE_LIST_REQUEST: {
      return {
        ...state,
        loadingMovieList: true,
        errorMovieList: null,
        movieDetail: null,
      };
    }
    case GET_MOVIE_LIST_SUCCESS: {
      return {
        ...state,
        movieList: action.payload.data,
        loadingMovieList: false,
      };
    }
    case GET_MOVIE_LIST_FAIL: {
      return {
        ...state,
        errorMovieList: action.payload.error,
        loadingMovieList: false,
      };
    }
    case GET_MOVIE_REQUEST: {
      return {
        ...state,
        loadingDetailMovie: true,
        errorDetailMovie: null,
        successDetailMovie: "",
      };
    }
    case GET_MOVIE_SUCCESS: {
      return {
        ...state,
        loadingDetailMovie: false,
        successDetailMovie: action.payload.data,
        errorDetailMovie: null,
      };
    }
    case GET_MOVIE_FAIL: {
      return {
        ...state,
        loadingDetailMovie: false,
        errorDetailMovie: action.payload.error,
        successDetailMovie: "",
      };
    }
    case DELETE_MOVIE_REQUEST: {
      return {
        ...state,
        loadingDeleteMovie: true,
        errorDeleteMovie: null,
        successDeleteMovie: "",
      };
    }
    case DELETE_MOVIE_SUCCESS: {
      return {
        ...state,
        loadingDeleteMovie: false,
        successDeleteMovie: action.payload.data,
        errorDeleteMovie: null,
      };
    }
    case DELETE_MOVIE_FAIL: {
      return {
        ...state,
        loadingDeleteMovie: false,
        errorDeleteMovie: action.payload.error,
        successDeleteMovie: "",
      };
    }

    case UPDATE_MOVIE_REQUEST: {
      return {
        ...state,
        loadingUpdateMovie: true,
        errorUpdateMovie: null,
        successUpdateMovie: "",
      };
    }
    case UPDATE_MOVIE_SUCCESS: {
      return {
        ...state,
        loadingUpdateMovie: false,
        successUpdateMovie: action.payload.data,
        errorUpdateMovie: null,
      };
    }
    case UPDATE_MOVIE_FAIL: {
      return {
        ...state,
        loadingUpdateMovie: false,
        errorUpdateMovie: action.payload.error,
        successUpdateMovie: "",
      };
    }

    case ADD_MOVIE_REQUEST: {
      return { ...state, loadingAddMovie: true, errorAddMovie: null };
    }
    case ADD_MOVIE_SUCCESS: {
      return {
        ...state,
        successAddMovie: action.payload.data,
        loadingAddMovie: false,
      };
    }
    case ADD_MOVIE_FAIL: {
      return {
        ...state,
        errorAddMovie: action.payload.error,
        loadingAddMovie: false,
      };
    }

    case RESET_MOVIE_MANAGEMENT: {
      return {
        ...state,
        successDetailMovie: "",

        loadingMovieList: false,
        errorMovieList: null,

        successDeleteMovie: "",
        loadingDeleteMovie: false,
        errorDeleteMovie: null,

        successUpdateMovie: "",
        loadingUpdateMovie: false,
        errorUpdateMovie: null,

        successAddMovie: "",
        loadingAddMovie: false,
        errorAddMovie: null,
      };
    }
    case RESET_MOVIE_DETAIL: {
      return {
        ...state,
        successDetailMovie: "",
        loadingDetailMovie: false,
        errorDetailMovie: null,
      };
    }
    default:
      return { ...state };
  }
};
