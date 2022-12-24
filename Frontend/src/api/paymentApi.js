import axiosClient from "./axiosClient";

const paymentApi = {
  createPaymentMoMo: (data) => {
    const url = "/v1/payments/create";
    return axiosClient.post(url, data);
  },

  queryPaymentMoMo: (data) => {
    const url = "/v1/payments/query";
    return axiosClient.post(url, data);
  },
};

export default paymentApi;
