import axiosClient from "./axiosClient";

const discountsApi = {
  getDiscountsList: () => {
    const path = "/v1/discounts";
    return axiosClient.get(path);
  },
  getDetailDiscount: (_id) => {
    const path = `/v1/discounts/${_id}`;
    return axiosClient.get(path);
  },
  updateDiscount: (data, _id) => {
    const path = `/v1/discounts/${_id}`;
    return axiosClient.patch(path, data);
  },
  postCreateDiscount: (data) => {
    const path = `/v1/discounts`;
    return axiosClient.post(path, data);
  },
  deleteDiscount: (_id) => {
    const path = `/v1/discounts/${_id}`;
    return axiosClient.delete(path);
  },
};

export default discountsApi;
