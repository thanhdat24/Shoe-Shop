import theatersSystemApi from "../../api/theatersSystemApi";
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

export const getTheaterSystemList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_THEATER_SYSTEM_LIST_REQUEST,
      });
      const result = await theatersSystemApi.getTheaterSystemList();
      dispatch({
        type: GET_THEATER_SYSTEM_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_THEATER_SYSTEM_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};
export const getDetailTheaterSystem = (_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_THEATER_SYSTEM_REQUEST,
      });
      const result = await theatersSystemApi.getDetailTheaterSystem(_id);
      dispatch({
        type: GET_THEATER_SYSTEM_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_THEATER_SYSTEM_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const getInfoShowtimeOfTheaterSystem = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_REQUEST,
      });
      const result = await theatersSystemApi.getInfoShowtimeOfTheaterSystem();
      dispatch({
        type: GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_SUCCES,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_INFO_SHOWTIME_OF_THEATER_SYSTEM_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};