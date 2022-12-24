import {
  PAYMENT_MOMO_FAIL,
  PAYMENT_MOMO_REQUEST,
  PAYMENT_MOMO_SUCCESS,
} from "../constants/Payment";

const stateDefault = {
  successPaymentMoMo: "",
  loadingPaymentMoMo: false,
  errorPaymentMoMo: null,
};

export const PaymentReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case PAYMENT_MOMO_REQUEST: {
      return {
        ...state,
        loadingPaymentMoMo: true,
        errorPaymentMoMo: null,
      };
    }
    case PAYMENT_MOMO_SUCCESS: {
      return {
        ...state,
        successPaymentMoMo: action.payload.data,
        loadingPaymentMoMo: false,
      };
    }
    case PAYMENT_MOMO_FAIL: {
      return {
        ...state,
        errorPaymentMoMo: action.payload.error,
        loadingPaymentMoMo: false,
      };
    }
    default:
      return { ...state };
  }
};
