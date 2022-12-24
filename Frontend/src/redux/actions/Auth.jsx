import usersApi from "../../api/usersApi";
import {
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  GET_CURRENT_USER_FAIL,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  GET_USER_SUCCESS_REQUEST,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  RESET_AUTH,
  RESET_ERROR_LOGIN_REGISTER,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_UPDATE,
  UPDATE_USER_CURRENT_FAIL,
  UPDATE_USER_CURRENT_REQUEST,
  UPDATE_USER_CURRENT_SUCCESS,
} from "../constants/Auth";

export const login = (user) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN_REQUEST,
      });
      const result = await usersApi.postLogin(user);
      dispatch({
        type: LOGIN_SUCCESS,
        data: result.data,
        token: result.data.token,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};
export const loginFirebase = (user) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: LOGIN_REQUEST,
      });
      const result = await usersApi.postLogin(user);
      dispatch({
        type: LOGIN_SUCCESS,
        data: result.data,
        token: result.data.token,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};
export const register = (user) => {
  return (dispatch) => {
    dispatch({
      type: REGISTER_REQUEST,
    });
    usersApi
      .postRegister(user)
      .then((result) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: REGISTER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    dispatch({
      type: LOGOUT,
    });
  };
};

export const updateCurrentUser = (currentUser) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_USER_CURRENT_REQUEST,
    });
    usersApi
      .updateCurrentUser(currentUser)
      .then((result) => {
        dispatch({
          type: UPDATE_USER_CURRENT_SUCCESS,
          payload: {
            status: result.data.status,
            data: result.data,
            token: result.data.token,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_USER_CURRENT_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const getDetailUser = (_id) => {
  return (dispatch) => {
    dispatch({
      type: GET_USER_SUCCESS_REQUEST,
    });
    usersApi
      .getDetailUser(_id)
      .then((result) => {
        dispatch({
          type: GET_USER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_USER_FAIL,
          payload: {
            error: error?.response.data.message,
          },
        });
      });
  };
};

export const getCurrentUser = () => {
  return (dispatch) => {
    dispatch({
      type: GET_CURRENT_USER_REQUEST,
    });
    usersApi
      .getCurrentUser()
      .then((result) => {
        console.log("reslut", result);
        dispatch({
          type: GET_CURRENT_USER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_CURRENT_USER_FAIL,
          payload: {
            error: error?.response.data.message,
          },
        });
      });
  };
};

export const sendOtp = (email) => {
  return (dispatch) => {
    dispatch({
      type: RESET_PASSWORD_REQUEST,
    });
    usersApi
      .sendOtp(email)
      .then((result) => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: RESET_PASSWORD_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const forgotPassword = (data) => {
  return (dispatch) => {
    dispatch({
      type: FORGOT_PASSWORD_REQUEST,
    });
    usersApi
      .forgotPassword(data)
      .then((result) => {
        dispatch({
          type: FORGOT_PASSWORD_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: FORGOT_PASSWORD_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const resetUpdate = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_UPDATE,
    });
  };
};

export const resetErrorLoginRegister = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_ERROR_LOGIN_REGISTER,
    });
  };
};
export const resetAuth = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_AUTH,
    });
  };
};
