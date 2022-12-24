import theatersApi from "../../api/theatersApi";
import {
  GET_THEATER_LIST_REQUEST,
  GET_THEATER_LIST_SUCCESS,
  GET_THEATER_LIST_FAIL,
  GET_SHOWTIMES_LIST_REQUEST,
  GET_SHOWTIMES_LIST_SUCCESS,
  GET_SHOWTIMES_LIST_FAIL,
  CREATE_THEATER_REQUEST,
  CREATE_THEATER_SUCCESS,
  CREATE_THEATER_FAIL,
  RESET_CREATE_THEATER,
  DELETE_THEATER_REQUEST,
  DELETE_THEATER_SUCCESS,
  DELETE_THEATER_FAIL,
  GET_THEATER_REQUEST,
  GET_THEATER_SUCCESS,
  GET_THEATER_FAIL,
  UPDATE_THEATER_REQUEST,
  UPDATE_THEATER_SUCCESS,
  UPDATE_THEATER_FAIL,
} from "../constants/Theater";
export const getTheaterList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_THEATER_LIST_REQUEST,
      });
      const result = await theatersApi.getTheaterList();
      dispatch({
        type: GET_THEATER_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_THEATER_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const getAllShowTimes = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_SHOWTIMES_LIST_REQUEST,
      });
      const result = await theatersApi.getAllShowTimes();
      dispatch({
        type: GET_SHOWTIMES_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_SHOWTIMES_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const createTheater = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CREATE_THEATER_REQUEST,
      });
      const result = await theatersApi.postCreateTheaters(data);
      console.log("result", result);
      dispatch({
        type: CREATE_THEATER_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: CREATE_THEATER_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const deleteTheater = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_THEATER_REQUEST,
    });
    theatersApi
      .deleteTheater(_id)
      .then((result) => {
        dispatch({
          type: DELETE_THEATER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_THEATER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const getDetailTheater = (_id) => {
  return (dispatch) => {
    dispatch({
      type: GET_THEATER_REQUEST,
    });
    theatersApi
      .getDetailTheater(_id)
      .then((result) => {
        dispatch({
          type: GET_THEATER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_THEATER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const updateTheater = (theater, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_THEATER_REQUEST,
    });
    theatersApi
      .updateTheater(theater, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_THEATER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_THEATER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};
export const resetCreateTheater = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_CREATE_THEATER,
    });
  };
};
