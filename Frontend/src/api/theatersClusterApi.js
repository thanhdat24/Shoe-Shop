import axiosClient from "./axiosClient";

const theatersClusterApi = {
  getTheaterClusterList: () => {
    const path = "/v1/theatercluster";
    return axiosClient.get(path);
  },

  getDetailTheaterCluster: (_id) => {
    const path = `/v1/theatercluster/${_id}`;
    return axiosClient.get(path);
  },
  getMovieInfoTheaterCluster: (movieId) => {
    const path = `/v1/theatercluster/getMovieInfoTheaterCluster/${movieId}`;
    return axiosClient.get(path);
  },
  postCreateTheaterCluster: (data) => {
    const path = `/v1/theatercluster`;
    return axiosClient.post(path, data);
  },

  deleteTheaterCluster: (_id) => {
    const path = `/v1/theatercluster/${_id}`;
    return axiosClient.delete(path);
  },
  updateTheaterCluster: (theaterCluster, _id) => {
    const path = `/v1/theatercluster/${_id}`;
    return axiosClient.patch(path, theaterCluster);
  },
};

export default theatersClusterApi;
