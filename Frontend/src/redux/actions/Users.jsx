import usersApi from "../../api/usersApi";
import { UPDATE_USER_CURRENT_FAIL } from "../constants/Auth";
import {
  CHANGE_PASSWORD_FAIL,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  DELETE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  GET_USER_LIST_FAIL,
  GET_USER_LIST_REQUEST,
  GET_USER_LIST_SUCCESS,
  RESET_PASSWORD,
  RESET_USER_LIST,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "../constants/Users";

export const getUsersList = () => {
  return (dispatch) => {
    dispatch({
      type: GET_USER_LIST_REQUEST,
    });
    usersApi
      .getUsersList()
      .then((result) => {
        dispatch({
          type: GET_USER_LIST_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_USER_LIST_FAIL,
          payload: {
            error: error,
          },
        });
      });
  };
};
export const deleteUser = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_USER_REQUEST,
    });
    usersApi
      .deleteUser(_id)
      .then((result) => {
        dispatch({
          type: DELETE_USER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_USER_FAIL,
          payload: {
            error: error,
          },
        });
      });
  };
};

export const changePassword = (currentUser) => {
  return (dispatch) => {
    dispatch({
      type: CHANGE_PASSWORD_REQUEST,
    });
    usersApi
      .changePassword(currentUser)
      .then((result) => {
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          payload: {
            status: result.data.status,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: CHANGE_PASSWORD_FAIL,
          payload: {
            error: error?.response.data.message,
          },
        });
      });
  };
};

export const updateUser = (user, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_USER_REQUEST,
    });
    usersApi
      .updateUser(user, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_USER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_USER_CURRENT_FAIL,
          payload: {
            error: error?.response.data.message,
          },
        });
      });
  };
};

export const resetUserList = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_USER_LIST,
    });
  };
};

export const resetPassword = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_PASSWORD,
    });
  };
};