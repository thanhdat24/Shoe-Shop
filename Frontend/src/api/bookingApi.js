import axiosClient from "./axiosClient";
const bookingApi = {
  postCreateShowTimes: (data) => {
    const path = `/v1/showtimes`;
    return axiosClient.post(path, data);
  },
  deleteShowTimes: (_id) => {
    const path = `/v1/showtimes/${_id}`;
    return axiosClient.delete(path);
  },
  getDetailShowtimes: (_id) => {
    const path = `/v1/showtimes/${_id}`;
    return axiosClient.get(path);
  },
  updateShowtimes: (_id, showtime) => {
    const path = `/v1/showtimes/${_id}`;
    return axiosClient.patch(path, showtime);
  },
  getDanhSachPhongVe: (_id) => {
    const path = `/v1/showtimes/${_id}`;
    return axiosClient.get(path);
  },
  postCreateTicket: (data) => {
    const path = `/v1/tickets`;
    return axiosClient.post(path, data);
  },
  getAllTicket: () => {
    const path = `/v1/tickets`;
    return axiosClient.get(path);
  },
  updateUnReadTicket: (ticket, _id) => {
    const path = `/v1/tickets/${_id}`;
    return axiosClient.patch(path, ticket);
  },
  getTicketRevenue: () => {
    const path = `/v1/tickets/getTicketRevenue`;
    return axiosClient.get(path);
  },

  getMovieRevenue: () => {
    const path = `/v1/tickets/getMovieRevenue`;
    return axiosClient.get(path);
  },

  getRevenueByDay: () => {
    const path = `/v1/tickets/getRevenueByDay`;
    return axiosClient.get(path);
  },
  
};

export default bookingApi;
