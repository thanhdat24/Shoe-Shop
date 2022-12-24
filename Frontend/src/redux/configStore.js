import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from "./reducers/Auth";
import { UserManagement } from "./reducers/Users";
import { MovieReducer } from "./reducers/Movie";
import { TheaterReducer } from "./reducers/Theater";
import { BookTicketReducer } from "./reducers/BookTicket";
import { ModalTrailerReducer } from "./reducers/ModalTrailer";
import { TheaterClusterReducer } from "./reducers/TheaterCluster";
import { TheaterSystemReducer } from "./reducers/TheaterSystem";
import { ReviewReducer } from "./reducers/Review";
import LazyReducer from "./reducers/Lazy";
import { DiscountReducer } from "./reducers/Discount";
import { PaymentReducer } from "./reducers/Payment";

const rootReducer = combineReducers({
  UserManagement,
  AuthReducer,
  MovieReducer,
  TheaterReducer,
  BookTicketReducer,
  ModalTrailerReducer,
  TheaterClusterReducer,
  TheaterSystemReducer,
  ReviewReducer,
  LazyReducer,
  DiscountReducer,
  PaymentReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
