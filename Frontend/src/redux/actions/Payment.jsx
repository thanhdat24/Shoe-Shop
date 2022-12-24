import paymentApi from "../../api/paymentApi";
import {
  PAYMENT_MOMO_FAIL,
  PAYMENT_MOMO_REQUEST,
  PAYMENT_MOMO_SUCCESS,
} from "../constants/Payment";

export const paymentMoMo = (data) => {
  return (dispatch) => {
    dispatch({
      type: PAYMENT_MOMO_REQUEST,
    });
    paymentApi
      .paymentMoMo(data)
      .then((result) => {
        console.log("result", result);

        dispatch({
          type: PAYMENT_MOMO_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: PAYMENT_MOMO_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};
