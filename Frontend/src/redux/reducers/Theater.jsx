import {
  CREATE_THEATER_FAIL,
  CREATE_THEATER_REQUEST,
  CREATE_THEATER_SUCCESS,
  DELETE_THEATER_FAIL,
  DELETE_THEATER_REQUEST,
  DELETE_THEATER_SUCCESS,
  GET_SHOWTIMES_LIST_FAIL,
  GET_SHOWTIMES_LIST_REQUEST,
  GET_SHOWTIMES_LIST_SUCCESS,
  GET_THEATER_FAIL,
  GET_THEATER_LIST_FAIL,
  GET_THEATER_LIST_REQUEST,
  GET_THEATER_LIST_SUCCESS,
  GET_THEATER_REQUEST,
  GET_THEATER_SUCCESS,
  RESET_CREATE_THEATER,
  RESET_THEATER_DETAIL,
  UPDATE_THEATER_FAIL,
  UPDATE_THEATER_REQUEST,
  UPDATE_THEATER_SUCCESS,
} from "../constants/Theater";

const stateDefault = {
  theaterList: [],
  loadingTheaterList: false,
  errorTheaterList: null,
  theaterDetail: null,

  showtimesList: [],
  loadingShowtimesList: false,
  errorShowtimesList: null,

  loadingCreateTheater: false,
  successCreateTheater: null,
  errorCreateTheater: null,

  successDeleteTheater: "",
  loadingDeleteTheater: false,
  errorDeleteTheater: null,

  successDetailTheater: "",
  loadingDetailTheater: false,
  errorDetailTheater: null,

  successUpdateTheater: "",
  loadingUpdateTheater: false,
  errorUpdateTheater: null,
};

export const TheaterReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_THEATER_LIST_REQUEST: {
      return {
        ...state,
        loadingTheaterList: true,
        errorTheaterList: null,
        theaterList: null,
      };
    }
    case GET_THEATER_LIST_SUCCESS: {
      return {
        ...state,
        theaterList: action.payload.data,
        loadingTheaterList: false,
      };
    }
    case GET_THEATER_LIST_FAIL: {
      return {
        ...state,
        errorTheaterList: action.payload.error,
        loadingTheaterList: false,
      };
    }

    case GET_SHOWTIMES_LIST_REQUEST: {
      return {
        ...state,
        loadingShowtimesList: true,
        errorShowtimesList: null,
        showtimesList: null,
      };
    }
    case GET_SHOWTIMES_LIST_SUCCESS: {
      return {
        ...state,
        showtimesList: action.payload.data,
        loadingShowtimesList: false,
      };
    }
    case GET_SHOWTIMES_LIST_FAIL: {
      return {
        ...state,

        errorShowtimesList: action.payload.error,
        loadingShowtimesList: false,
      };
    }

    case CREATE_THEATER_REQUEST: {
      return {
        ...state,
        loadingCreateTheater: true,
        errorCreateTheater: null,
      };
    }
    case CREATE_THEATER_SUCCESS: {
      return {
        ...state,
        successCreateTheater: action.payload.data,
        loadingCreateTheater: false,
      };
    }
    case CREATE_THEATER_FAIL: {
      return {
        ...state,
        errorDeleteTheater: action.payload.error,
        loadingDeleteTheater: false,
      };
    }

    case DELETE_THEATER_REQUEST: {
      return {
        ...state,
        loadingDeleteTheater: true,
        errorDeleteTheater: null,
        successDeleteTheater: "",
      };
    }
    case DELETE_THEATER_SUCCESS: {
      return {
        ...state,
        loadingDeleteTheater: false,
        successDeleteTheater: action.payload.data,
        errorDeleteTheater: null,
      };
    }
    case DELETE_THEATER_FAIL: {
      return {
        ...state,
        loadingDeleteTheater: false,
        errorDeleteTheater: action.payload.error,
        successDeleteTheater: "",
      };
    }

    case GET_THEATER_REQUEST: {
      return {
        ...state,
        loadingDetailTheater: true,
        errorDetailTheater: null,
        successDetailTheater: "",
      };
    }
    case GET_THEATER_SUCCESS: {
      return {
        ...state,
        loadingDetailTheater: false,
        successDetailTheater: action.payload.data,
        errorDetailTheater: null,
      };
    }
    case GET_THEATER_FAIL: {
      return {
        ...state,
        loadingDetailTheater: false,
        errorDetailTheater: action.payload.error,
        successDetailTheater: "",
      };
    }
    case UPDATE_THEATER_REQUEST: {
      return {
        ...state,
        loadingUpdateTheater: true,
        errorUpdateTheater: null,
        successUpdateTheater: "",
      };
    }
    case UPDATE_THEATER_SUCCESS: {
      return {
        ...state,
        loadingUpdateTheater: false,
        successUpdateTheater: action.payload.data,
        errorUpdateTheater: null,
      };
    }
    case UPDATE_THEATER_FAIL: {
      return {
        ...state,
        loadingUpdateTheater: false,
        errorUpdateTheater: action.payload.error,
        successUpdateTheater: "",
      };
    }

    case RESET_THEATER_DETAIL: {
      return {
        ...state,
        successDetailTheater: "",
        loadingDetailTheater: false,
        errorDetailTheater: null,
      };
    }

    case RESET_CREATE_THEATER: {
      state.loadingCreateTheater = false;
      state.successCreateTheater = null;
      state.errorCreateTheater = null;

      state.loadingDeleteTheater = false;
      state.successDeleteTheater = null;
      state.errorDeleteTheater = null;

      state.successUpdateTheater = null;
      state.loadingUpdateTheater = false;
      state.errorUpdateTheater = null;
      return state;
    }
    default:
      return { ...state };
  }
};
