import axiosClient from "./axiosClient";

const moviesApi = {
  getMoviesList: () => {
    const path = "/v1/movies";
    return axiosClient.get(path);
  },
  deleteMovie: (_id) => {
    const path = `/v1/movies/${_id}`;
    return axiosClient.delete(path);
  },
  updateMovie: (data, _id) => {
    const path = `/v1/movies/${_id}`;
    return axiosClient.patch(path, data);
  },
  getDetailMovie: (_id) => {
    const path = `/v1/movies/getMovieShowtimeInfo/${_id}`;
    return axiosClient.get(path);
  },
  addMovieUploadImg: (data) => {
    const path = `/v1/movies`;

    return axiosClient.post(path, data);
  },
  searchMovie: (name) => {
    const path = "/v1/movies/search-movie";
    return axiosClient.post(path, name);
  },
};

export default moviesApi;
