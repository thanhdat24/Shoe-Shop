import {
  BOOK_TICKET_FAIL,
  BOOK_TICKET_REQUEST,
  BOOK_TICKET_SUCCESS,
  CHANGE_LISTSEAT,
  CREATE_SHOWTIME_FAIL,
  CREATE_SHOWTIME_REQUEST,
  CREATE_SHOWTIME_SUCCESS,
  DELETE_SHOWTIME_FAIL,
  DELETE_SHOWTIME_REQUEST,
  DELETE_SHOWTIME_SUCCESS,
  GET_DAY_REVENUE_FAIL,
  GET_DAY_REVENUE_REQUEST,
  GET_DAY_REVENUE_SUCCESS,
  GET_LISTSEAT_FAIL,
  GET_LISTSEAT_REQUEST,
  GET_LISTSEAT_SUCCESS,
  GET_MOVIE_REVENUE_FAIL,
  GET_MOVIE_REVENUE_REQUEST,
  GET_MOVIE_REVENUE_SUCCESS,
  GET_SHOWTIME_FAIL,
  GET_SHOWTIME_REQUEST,
  GET_SHOWTIME_SUCCESS,
  GET_TICKET_LIST_FAIL,
  GET_TICKET_LIST_REQUEST,
  GET_TICKET_LIST_SUCCESS,
  GET_TICKET_REVENUE_FAIL,
  GET_TICKET_REVENUE_REQUEST,
  GET_TICKET_REVENUE_SUCCESS,
  INIT_DATA,
  RESET_ALERT_OVER10,
  RESET_CREATE_SHOWTIME,
  RESET_DATA_BOOKTICKET,
  RESET_SHOWTIME_DETAIL,
  SET_ALERT_OVER10,
  SET_DATA_PAYMENT,
  SET_READY_PAYMENT,
  SET_STEP,
  TIMEOUT,
  UPDATE_SHOWTIME_FAIL,
  UPDATE_SHOWTIME_REQUEST,
  UPDATE_SHOWTIME_SUCCESS,
  UPDATE_UNREAD_TICKET_FAIL,
  UPDATE_UNREAD_TICKET_REQUEST,
  UPDATE_UNREAD_TICKET_SUCCESS,
} from "../constants/BookTicket";

const stateDefault = {
  // get list seat
  loadingGetListSeat: false,
  danhSachPhongVe: {},
  danhSachGheKhachDat: [],
  errorGetListSeatMessage: null,

  // booking ticked
  loadingBookingTicket: false,
  successBookingTicket: null,
  errorBookTicket: null,

  ticketList: [],
  loadingTicketList: false,
  errorTicketList: null,

  ticketRevenue: [],
  loadingTicketRevenue: false,
  errorTicketRevenue: null,

  movieRevenue: [],
  loadingMovieRevenue: false,
  errorMovieRevenue: null,

  dayRevenue: [],
  loadingDayRevenue: false,
  errorDayRevenue: null,

  // selecting seat
  listSeat: [],
  isSelectedSeat: false,
  listSeatSelected: [],
  seatCodes: [],
  amount: 0,

  timeOut: false,
  isMobile: false,
  refreshKey: Date.now(),

  idShowtime: null,
  userName: null,

  alertOver10: false,

  // payment
  email: "",
  phone: "",
  paymentMethod: "",
  isReadyPayment: false,
  activeStep: 0,
  discount: 0,
  miniPrice: 0,

  loadingCreateShowtime: false,
  successCreateShowtime: null,
  errorCreateShowtime: null,

  loadingDeleteShowtime: false,
  successDeleteShowtime: null,
  errorDeleteShowtime: null,

  successDetailShowtime: "",
  loadingDetailShowtime: false,
  errorDetailShowtime: null,

  successUpdateShowtime: "",
  loadingUpdateShowtime: false,
  errorUpdateShowtime: null,

  successUpdateUnReadTicket: "",
  loadingUpdateUnReadTicket: false,
  errorUpdateUnReadTicket: null,
};

export const BookTicketReducer = (state = stateDefault, action) => {
  switch (action.type) {
    // initialization data
    case "DAT_GHE": {
      return { ...state, danhSachGheKhachDat: action.arrGheKhachDat };
    }
    case GET_LISTSEAT_REQUEST: {
      return {
        ...state,
        loadingGetListSeat: true,
        errorGetListSeatMessage: null,
      };
    }
    case GET_LISTSEAT_SUCCESS: {
      return {
        ...state,
        danhSachPhongVe: action.payload.data,
        loadingGetListSeat: false,
      };
    }
    case GET_LISTSEAT_FAIL: {
      return {
        ...state,
        errorGetListSeatMessage: action.payload.error,
        loadingGetListSeat: false,
      };
    }
    case INIT_DATA: {
      return {
        ...state,
        listSeat: action.payload.listSeat,
        idShowtime: action.payload.idShowtime,
        userName: action.payload.userName,
        email: action.payload.email,
        phone: action.payload.phone,
      };
    }

    // selecting seat
    case CHANGE_LISTSEAT: {
      return {
        ...state,
        listSeat: action.payload.listSeat,
        isSelectedSeat: action.payload.isSelectedSeat,
        listSeatSelected: action.payload.listSeatSelected,
        seatCodes: action.payload.seatCodes,
        amount: action.payload.amount,
      };
    }
    case RESET_DATA_BOOKTICKET: {
      return {
        ...state,
        ...state,
        danhSachPhongVe: {},
        paymentMethod: "",
        discount: "",
        miniPrice: "",
        isReadyPayment: false,
        isSelectedSeat: false,
        listSeatSelected: [],
        timeOut: false,
        activeStep: 0,
        seatCodes: [],
        successBookingTicket: null,
        errorBookTicket: null,
        refreshKey: Date.now(),
        amount: 0,
        alertOver10: false,
      };
    }
    case SET_DATA_PAYMENT: {
      return {
        ...state,
        email: action.payload.email,
        phone: action.payload.phone,
        paymentMethod: action.payload.paymentMethod,
        discount: action.payload.discount,
        miniPrice: action.payload.miniPrice,
      };
    }
    case SET_READY_PAYMENT: {
      return {
        ...state,
        isReadyPayment: action.payload.isReadyPayment,
      };
    }
    case SET_STEP: {
      return {
        ...state,
        activeStep: action.payload.activeStep,
      };
    }
    case RESET_ALERT_OVER10: {
      return {
        ...state,
        alertOver10: false,
      };
    }

    case RESET_SHOWTIME_DETAIL: {
      return {
        ...state,
        successDetailShowtime: "",
        loadingDetailShowtime: false,
        errorDetailShowtime: null,
      };
    }
    case SET_ALERT_OVER10: {
      return {
        ...state,
        alertOver10: true,
      };
    }

    // booking ticked
    case BOOK_TICKET_REQUEST: {
      return {
        ...state,
        loadingBookingTicket: true,
        errorBookTicketMessage: null,
      };
    }
    case BOOK_TICKET_SUCCESS: {
      return {
        ...state,
        successBookingTicket: action.payload.data,
        loadingBookingTicket: false,
        activeStep: 2,
      };
    }
    case BOOK_TICKET_FAIL: {
      return {
        ...state,
        errorBookTicketMessage: action.payload.error,
        loadingBookingTicket: false,
        activeStep: 2,
      };
    }

    case GET_TICKET_LIST_REQUEST: {
      return {
        ...state,
        loadingTicketList: true,
        errorTicketList: null,
        movieDetail: null,
      };
    }
    case GET_TICKET_LIST_SUCCESS: {
      return {
        ...state,
        ticketList: action.payload.data,
        loadingTicketList: false,
      };
    }
    case GET_TICKET_LIST_FAIL: {
      return {
        ...state,
        errorTicketList: action.payload.error,
        loadingTicketList: false,
      };
    }

    case GET_TICKET_REVENUE_REQUEST: {
      return {
        ...state,
        loadingTicketRevenue: true,
        errorTicketRevenue: null,
      };
    }
    case GET_TICKET_REVENUE_SUCCESS: {
      return {
        ...state,
        ticketRevenue: action.payload.data,
        loadingTicketRevenue: false,
      };
    }
    case GET_TICKET_REVENUE_FAIL: {
      return {
        ...state,
        errorMovieRevenue: action.payload.error,
        loadingMovieRevenue: false,
      };
    }

    case GET_MOVIE_REVENUE_REQUEST: {
      return {
        ...state,
        loadingMovieRevenue: true,
        errorMovieRevenue: null,
      };
    }
    case GET_MOVIE_REVENUE_SUCCESS: {
      return {
        ...state,
        movieRevenue: action.payload.data,
        loadingMovieRevenue: false,
      };
    }
    case GET_MOVIE_REVENUE_FAIL: {
      return {
        ...state,
        errorTicketRevenue: action.payload.error,
        loadingTicketRevenue: false,
      };
    }

    case GET_DAY_REVENUE_REQUEST: {
      return {
        ...state,
        loadingDayRevenue: true,
        errorDayRevenue: null,
      };
    }
    case GET_DAY_REVENUE_SUCCESS: {
      return {
        ...state,
        dayRevenue: action.payload.data,
        loadingDayRevenue: false,
      };
    }
    case GET_DAY_REVENUE_FAIL: {
      return {
        ...state,
        errorTicketRevenue: action.payload.error,
        loadingTicketRevenue: false,
      };
    }
    // control modal
    case TIMEOUT: {
      return {
        ...state,
        timeOut: true,
      };
    }

    case CREATE_SHOWTIME_REQUEST: {
      return {
        ...state,
        loadingCreateShowtime: true,
        errorCreateShowtime: null,
      };
    }
    case CREATE_SHOWTIME_SUCCESS: {
      return {
        ...state,
        successCreateShowtime: action.payload.data,
        loadingCreateShowtime: false,
      };
    }
    case CREATE_SHOWTIME_FAIL: {
      return {
        ...state,
        errorDeleteShowtime: action.payload.error,
        loadingDeleteShowtime: false,
      };
    }
    case DELETE_SHOWTIME_REQUEST: {
      return {
        ...state,
        loadingDeleteShowtime: true,
        errorDeleteShowtime: null,
      };
    }
    case DELETE_SHOWTIME_SUCCESS: {
      return {
        ...state,
        successDeleteShowtime: action.payload.data,
        loadingDeleteShowtime: false,
      };
    }
    case DELETE_SHOWTIME_FAIL: {
      return {
        ...state,
        errorDeleteShowtime: action.payload.error,
        loadingDeleteShowtime: false,
      };
    }
    case GET_SHOWTIME_REQUEST: {
      return {
        ...state,
        loadingDetailShowtime: true,
        errorDetailShowtime: null,
        successDetailShowtime: "",
      };
    }
    case GET_SHOWTIME_SUCCESS: {
      return {
        ...state,
        loadingDetailShowtime: false,
        successDetailShowtime: action.payload.data,
        errorDetailShowtime: null,
      };
    }
    case GET_SHOWTIME_FAIL: {
      return {
        ...state,
        loadingDetailShowtime: false,
        errorDetailShowtime: action.payload.error,
        successDetailShowtime: "",
      };
    }
    case UPDATE_SHOWTIME_REQUEST: {
      return {
        ...state,
        loadingUpdateShowtime: true,
        errorUpdateShowtime: null,
        successUpdateShowtime: "",
      };
    }
    case UPDATE_SHOWTIME_SUCCESS: {
      return {
        ...state,
        loadingUpdateShowtime: false,
        successUpdateShowtime: action.payload.data,
        errorUpdateShowtime: null,
      };
    }
    case UPDATE_SHOWTIME_FAIL: {
      return {
        ...state,
        loadingUpdateShowtime: false,
        errorUpdateShowtime: action.payload.error,
        successUpdateShowtime: "",
      };
    }

    case UPDATE_UNREAD_TICKET_REQUEST: {
      return {
        ...state,
        loadingUpdateUnReadTicket: true,
        errorUpdateUnReadTicket: null,
        successUpdateUnReadTicket: "",
      };
    }
    case UPDATE_UNREAD_TICKET_SUCCESS: {
      return {
        ...state,
        loadingUpdateUnReadTicket: false,
        successUpdateUnReadTicket: action.payload.data,
        errorUpdateUnReadTicket: null,
      };
    }
    case UPDATE_UNREAD_TICKET_FAIL: {
      return {
        ...state,
        loadingUpdateUnReadTicket: false,
        errorUpdateUnReadTicket: action.payload.error,
        successUpdateUnReadTicket: "",
      };
    }

    case RESET_CREATE_SHOWTIME: {
      state.loadingCreateShowtime = false;
      state.successCreateShowtime = null;
      state.errorCreateShowtime = null;

      state.loadingDeleteShowtime = false;
      state.successDeleteShowtime = null;
      state.errorDeleteShowtime = null;

      state.successUpdateShowtime = null;
      state.loadingUpdateShowtime = false;
      state.errorUpdateShowtimee = null;

      return state;
    }
    default:
      return { ...state };
  }
};
