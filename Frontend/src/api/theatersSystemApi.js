import axiosClient from "./axiosClient";

const theatersSystemApi = {
  getTheaterSystemList: () => {
    const path = "/v1/theatersystem";
    return axiosClient.get(path);
  },
  getDetailTheaterSystem: (_id) => {
    const path = `/v1/theatersystem/${_id}`;
    return axiosClient.get(path);
  },
  getInfoShowtimeOfTheaterSystem: () => {
    const path = "/v1/theatersystem/getInfoShowtimeOfTheaterSystem";
    return axiosClient.get(path);
  },
};

export default theatersSystemApi;
