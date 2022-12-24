import {
  GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_FAIL,
  GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_REQUEST,
  GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_SUCCES,
  GET_THEATER_SYSTEM_FAIL,
  GET_THEATER_SYSTEM_LIST_FAIL,
  GET_THEATER_SYSTEM_LIST_REQUEST,
  GET_THEATER_SYSTEM_LIST_SUCCESS,
  GET_THEATER_SYSTEM_REQUEST,
  GET_THEATER_SYSTEM_SUCCESS,
} from "../constants/TheaterSystem";

const stateDefault = {
  theaterSystemList: [],
  loadingTheaterSystemList: false,
  errorTheaterSystemList: null,

  successDetailTheaterSystem: "",
  loadingDetailTheaterSystem: false,
  errorDetailTheaterSystem: null,

  showtimeTheaterSystemList: [],
  loadingShowtimeTheaterSystemList: false,
  errorShowtimeTheaterSystemList: null,
};

export const TheaterSystemReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_THEATER_SYSTEM_LIST_REQUEST: {
      return {
        ...state,
        loadingTheaterSystemList: true,
        errorTheaterSystemList: null,
        theaterSystemList: null,
      };
    }
    case GET_THEATER_SYSTEM_LIST_SUCCESS: {
      return {
        ...state,
        theaterSystemList: action.payload.data,
        loadingTheaterSystemList: false,
      };
    }
    case GET_THEATER_SYSTEM_LIST_FAIL: {
      return {
        ...state,
        errorTheaterSystemList: action.payload.error,
        loadingTheaterSystemList: false,
      };
    }
    case GET_THEATER_SYSTEM_REQUEST: {
      return {
        ...state,
        loadingDetailTheaterSystem: true,
        errorDetailTheaterSystem: null,
        successDetailTheaterSystem: "",
      };
    }
    case GET_THEATER_SYSTEM_SUCCESS: {
      return {
        ...state,
        loadingDetailTheaterSystem: false,
        successDetailTheaterSystem: action.payload.data,
        errorDetailTheaterSystem: null,
      };
    }
    case GET_THEATER_SYSTEM_FAIL: {
      return {
        ...state,
        loadingDetailTheaterSystem: false,
        errorDetailTheaterSystem: action.payload.error,
        successDetailTheaterSystem: "",
      };
    }

    case GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_REQUEST: {
      return {
        ...state,
        loadingShowtimeTheaterSystemList: true,
        errorShowtimeTheaterSystemList: null,
        showtimeTheaterSystemList: null,
      };
    }
    case GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_SUCCES: {
      return {
        ...state,
        showtimeTheaterSystemList: action.payload.data,
        loadingShowtimeTheaterSystemList: false,
      };
    }
    case GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_FAIL: {
      return {
        ...state,
        errorShowtimeTheaterSystemList: action.payload.error,
        loadingShowtimeTheaterSystemList: false,
      };
    }
    default:
      return { ...state };
  }
};
