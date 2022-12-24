import discountsApi from "../../api/discountApi";
import {
  CREATE_DISCOUNT_FAIL,
  CREATE_DISCOUNT_REQUEST,
  CREATE_DISCOUNT_SUCCESS,
  DELETE_DISCOUNT_FAIL,
  DELETE_DISCOUNT_REQUEST,
  DELETE_DISCOUNT_SUCCESS,
  GET_DISCOUNT_FAIL,
  GET_DISCOUNT_LIST_FAIL,
  GET_DISCOUNT_LIST_REQUEST,
  GET_DISCOUNT_LIST_SUCCESS,
  GET_DISCOUNT_REQUEST,
  GET_DISCOUNT_SUCCESS,
  RESET_DISCOUNT,
  UPDATE_ACTIVE_DISCOUNT_FAIL,
  UPDATE_ACTIVE_DISCOUNT_REQUEST,
  UPDATE_ACTIVE_DISCOUNT_SUCCESS,
} from "../constants/Discount";
export const getDiscountsList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_DISCOUNT_LIST_REQUEST,
      });
      const result = await discountsApi.getDiscountsList();
      dispatch({
        type: GET_DISCOUNT_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_DISCOUNT_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const getDetailDiscount = (_id) => {
  return (dispatch) => {
    dispatch({
      type: GET_DISCOUNT_REQUEST,
    });
    discountsApi
      .getDetailDiscount(_id)
      .then((result) => {
        dispatch({
          type: GET_DISCOUNT_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_DISCOUNT_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const updateDiscount = (data, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_ACTIVE_DISCOUNT_REQUEST,
    });
    discountsApi
      .updateDiscount(data, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_ACTIVE_DISCOUNT_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_ACTIVE_DISCOUNT_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};
export const createDiscount = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CREATE_DISCOUNT_REQUEST,
      });
      const result = await discountsApi.postCreateDiscount(data);
      dispatch({
        type: CREATE_DISCOUNT_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: CREATE_DISCOUNT_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const deleteDiscount = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_DISCOUNT_REQUEST,
    });
    discountsApi
      .deleteDiscount(_id)
      .then((result) => {
        dispatch({
          type: DELETE_DISCOUNT_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_DISCOUNT_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const resetDiscount = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_DISCOUNT,
    });
  };
};
