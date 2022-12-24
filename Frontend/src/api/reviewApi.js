import axiosClient from "./axiosClient";

const reviewApi = {
  getAllReview: () => {
    const path = "/v1/reviews";
    return axiosClient.get(path);
  },

  postReview: (newPost) => {
    const path = "/v1/reviews";
    return axiosClient.post(path, newPost);
  },
  likeComment: (id, newPost) => {
    const path = `/v1/reviews/${id}`;
    return axiosClient.patch(path, newPost);
  },
  updateActiveReview: (active, _id) => {
    const path = `/v1/reviews/${_id}`;
    return axiosClient.patch(path, active);
  },
  deleteReview: (_id) => {
    const path = `/v1/reviews/${_id}`;
    return axiosClient.delete(path);
  },
};

export default reviewApi;
