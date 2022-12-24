import bookingApi from "../../api/bookingApi";
import {
  CREATE_SHOWTIME_FAIL,
  CREATE_SHOWTIME_REQUEST,
  CREATE_SHOWTIME_SUCCESS,
  DELETE_SHOWTIME_FAIL,
  DELETE_SHOWTIME_REQUEST,
  DELETE_SHOWTIME_SUCCESS,
  GET_SHOWTIME_FAIL,
  GET_SHOWTIME_REQUEST,
  GET_SHOWTIME_SUCCESS,
  RESET_CREATE_SHOWTIME,
  UPDATE_SHOWTIME_REQUEST,
  UPDATE_SHOWTIME_SUCCESS,
  UPDATE_SHOWTIME_FAIL,
  GET_LISTSEAT_REQUEST,
  GET_LISTSEAT_SUCCESS,
  GET_LISTSEAT_FAIL,
  BOOK_TICKET_REQUEST,
  BOOK_TICKET_SUCCESS,
  BOOK_TICKET_FAIL,
  GET_TICKET_LIST_REQUEST,
  GET_TICKET_LIST_SUCCESS,
  GET_TICKET_LIST_FAIL,
  UPDATE_UNREAD_TICKET_REQUEST,
  UPDATE_UNREAD_TICKET_SUCCESS,
  UPDATE_UNREAD_TICKET_FAIL,
  GET_TICKET_REVENUE_REQUEST,
  GET_TICKET_REVENUE_SUCCESS,
  GET_TICKET_REVENUE_FAIL,
  GET_MOVIE_REVENUE_REQUEST,
  GET_MOVIE_REVENUE_SUCCESS,
  GET_MOVIE_REVENUE_FAIL,
  GET_DAY_REVENUE_REQUEST,
  GET_DAY_REVENUE_SUCCESS,
  GET_DAY_REVENUE_FAIL,
} from "../constants/BookTicket";

export const createShowtime = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CREATE_SHOWTIME_REQUEST,
      });
      const result = await bookingApi.postCreateShowTimes(data);
      dispatch({
        type: CREATE_SHOWTIME_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: CREATE_SHOWTIME_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const deleteShowTimes = (_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: DELETE_SHOWTIME_REQUEST,
      });
      const result = await bookingApi.deleteShowTimes(_id);
      dispatch({
        type: DELETE_SHOWTIME_SUCCESS,
        payload: {
          data: result.data.data,
        },
      });
    } catch (error) {
      dispatch({
        type: DELETE_SHOWTIME_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const getDetailShowtimes = (_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_SHOWTIME_REQUEST,
      });
      const result = await bookingApi.getDetailShowtimes(_id);
      console.log("result", result);
      dispatch({
        type: GET_SHOWTIME_SUCCESS,
        payload: {
          data: result.data.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_SHOWTIME_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const updateShowtime = (_id, showtime) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SHOWTIME_REQUEST,
    });
    bookingApi
      .updateShowtimes(_id, showtime)
      .then((result) => {
        dispatch({
          type: UPDATE_SHOWTIME_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_SHOWTIME_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const resetCreateShowtime = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_CREATE_SHOWTIME,
    });
  };
};

export const getListSeat = (idShowtime) => {
  return (dispatch) => {
    dispatch({
      type: GET_LISTSEAT_REQUEST,
    });
    bookingApi
      .getDanhSachPhongVe(idShowtime)
      .then((result) => {
        dispatch({
          type: GET_LISTSEAT_SUCCESS,
          payload: { data: result.data },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_LISTSEAT_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const postCreateTicket = (data) => {
  return (dispatch, getState) => {
    dispatch({
      type: BOOK_TICKET_REQUEST,
    });
    bookingApi
      .postCreateTicket(data)
      .then((result) => {
        dispatch({
          type: BOOK_TICKET_SUCCESS,
          payload: {
            data: result.data,
          },
        });
        // socket.current.emit(
        //   "send successBookingTicket client to server",
        //   // currentUser.user.email,
        //   data.idShowtime
        // );
      })
      .catch((error) => {
        dispatch({
          type: BOOK_TICKET_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const getAllTicket = () => {
  return (dispatch) => {
    dispatch({
      type: GET_TICKET_LIST_REQUEST,
    });
    bookingApi
      .getAllTicket()
      .then((result) => {
        dispatch({
          type: GET_TICKET_LIST_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_TICKET_LIST_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const updateUnReadTicket = (ticket, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_UNREAD_TICKET_REQUEST,
    });
    bookingApi
      .updateUnReadTicket(ticket, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_UNREAD_TICKET_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_UNREAD_TICKET_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const getTicketRevenue = () => {
  return (dispatch) => {
    dispatch({
      type: GET_TICKET_REVENUE_REQUEST,
    });
    bookingApi
      .getTicketRevenue()
      .then((result) => {
        dispatch({
          type: GET_TICKET_REVENUE_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_TICKET_REVENUE_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const getMovieRevenue = () => {
  return (dispatch) => {
    dispatch({
      type: GET_MOVIE_REVENUE_REQUEST,
    });
    bookingApi
      .getMovieRevenue()
      .then((result) => {
        dispatch({
          type: GET_MOVIE_REVENUE_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_MOVIE_REVENUE_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};

export const getRevenueByDay = () => {
  return (dispatch) => {
    dispatch({
      type: GET_DAY_REVENUE_REQUEST,
    });
    bookingApi
      .getRevenueByDay()
      .then((result) => {
        dispatch({
          type: GET_DAY_REVENUE_SUCCESS,
          payload: {
            data: result.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: GET_DAY_REVENUE_FAIL,
          payload: {
            error: error.response?.data ? error.response.data : error.message,
          },
        });
      });
  };
};
