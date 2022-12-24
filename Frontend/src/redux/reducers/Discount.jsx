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
  RESET_DISCOUNT_DETAIL,
  UPDATE_ACTIVE_DISCOUNT_FAIL,
  UPDATE_ACTIVE_DISCOUNT_REQUEST,
  UPDATE_ACTIVE_DISCOUNT_SUCCESS,
} from "../constants/Discount";

const stateDefault = {
  discountList: [],
  loadingDiscountList: false,
  errorDiscountList: null,

  successUpdateDiscount: "",
  loadingUpdateDiscount: false,
  errorUpdateDiscount: null,

  loadingCreateDiscount: false,
  successCreateDiscount: null,
  errorCreateDiscount: null,

  successDetailDiscount: "",
  loadingDetailDiscount: false,
  errorDetailDiscount: null,

  successDeleteDiscount: "",
  loadingDeleteDiscount: false,
  errorDeleteDiscount: null,
};

export const DiscountReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_DISCOUNT_LIST_REQUEST: {
      return {
        ...state,
        loadingDiscountList: true,
        errorDiscountList: null,
      };
    }
    case GET_DISCOUNT_LIST_SUCCESS: {
      return {
        ...state,
        discountList: action.payload.data,
        loadingDiscountList: false,
      };
    }
    case GET_DISCOUNT_LIST_FAIL: {
      return {
        ...state,
        errorDiscountList: action.payload.error,
        loadingDiscountList: false,
      };
    }
    case UPDATE_ACTIVE_DISCOUNT_REQUEST: {
      return {
        ...state,
        loadingUpdateDiscount: true,
        errorUpdateDiscount: null,
        successUpdateDiscount: "",
      };
    }
    case UPDATE_ACTIVE_DISCOUNT_SUCCESS: {
      return {
        ...state,
        loadingUpdateDiscount: false,
        successUpdateDiscount: action.payload.data,
        errorUpdateDiscount: null,
      };
    }
    case UPDATE_ACTIVE_DISCOUNT_FAIL: {
      return {
        ...state,
        loadingUpdateDiscount: false,
        errorUpdateDiscount: action.payload.error,
        successUpdateDiscount: "",
      };
    }

    case CREATE_DISCOUNT_REQUEST: {
      return {
        ...state,
        loadingCreateDiscount: true,
        errorCreateDiscount: null,
      };
    }
    case CREATE_DISCOUNT_SUCCESS: {
      return {
        ...state,
        successCreateDiscount: action.payload.data,
        loadingCreateDiscount: false,
      };
    }
    case CREATE_DISCOUNT_FAIL: {
      return {
        ...state,
        errorDeleteDiscount: action.payload.error,
        loadingDeleteDiscount: false,
      };
    }

    case GET_DISCOUNT_REQUEST: {
      return {
        ...state,
        loadingDetailDiscount: true,
        errorDetailDiscount: null,
        successDetailDiscount: "",
      };
    }
    case GET_DISCOUNT_SUCCESS: {
      return {
        ...state,
        loadingDetailDiscount: false,
        successDetailDiscount: action.payload.data,
        errorDetailDiscount: null,
      };
    }
    case GET_DISCOUNT_FAIL: {
      return {
        ...state,
        loadingDetailDiscount: false,
        errorDetailDiscount: action.payload.error,
        successDetailDiscount: "",
      };
    }

    case DELETE_DISCOUNT_REQUEST: {
      return {
        ...state,
        loadingDeleteDiscount: true,
        errorDeleteDiscount: null,
        successDeleteDiscount: "",
      };
    }
    case DELETE_DISCOUNT_SUCCESS: {
      return {
        ...state,
        loadingDeleteDiscount: false,
        successDeleteDiscount: action.payload.data,
        errorDeleteDiscount: null,
      };
    }
    case DELETE_DISCOUNT_FAIL: {
      return {
        ...state,
        loadingDeleteDiscount: false,
        errorDeleteDiscount: action.payload.error,
        successDeleteDiscount: "",
      };
    }

    case RESET_DISCOUNT: {
      return {
        ...state,
        successUpdateDiscount: "",
        loadingUpdateDiscount: false,
        errorUpdateDiscount: null,

        successCreateDiscount: "",
        errorCreateDiscount: null,

        successDeleteDiscount: "",
        loadingDeleteDiscount: false,
        errorDeleteDiscount: null,
      };
    }
    case RESET_DISCOUNT_DETAIL: {
      return {
        ...state,
        successDetailDiscount: "",
        loadingDetailDiscount: false,
        errorDetailDiscount: null,
      };
    }
    default:
      return { ...state };
  }
};
