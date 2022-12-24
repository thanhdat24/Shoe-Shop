import { TOKEN, USER_LOGIN } from "../../constants/config";
import { getAuth, signOut } from "firebase/auth";
import {
  FORGOT_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  GET_CURRENT_USER_FAIL,
  GET_CURRENT_USER_REQUEST,
  GET_CURRENT_USER_SUCCESS,
  GET_USER_FAIL,
  GET_USER_SUCCESS,
  GET_USER_SUCCESS_REQUEST,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  RESET_AUTH,
  RESET_CURRENT_USER,
  RESET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_UPDATE,
  UPDATE_USER_CURRENT_FAIL,
  UPDATE_USER_CURRENT_REQUEST,
  UPDATE_USER_CURRENT_SUCCESS,
} from "../constants/Auth";
const currentUser = localStorage.getItem(USER_LOGIN)
  ? JSON.parse(localStorage.getItem(USER_LOGIN))
  : null;

const stateDefault = {
  currentUser: currentUser,
  loadingLogin: false,
  errorLogin: null,

  responseRegister: null,
  loadingRegister: false,
  errorRegister: null,

  responseResetPassword: null,
  loadingResetPassword: false,
  errorResetPassword: null,

  responseForgotPassword: null,
  loadingForgotPassword: false,
  errorForgotPassword: null,

  successUpdateUserCurrent: null,
  loadingUpdateUserCurrent: false,
  errorUpdateUserCurrent: null,

  loadingGetDetailUser: false,
  successGetDetailUser: null,
  errorGetDetailUser: null,

  currentUserLogin: null,
  loadingCurrentUserLogin: false,
  errorCurrentUserLogin: null,
};

export const AuthReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case LOGIN_REQUEST: {
      return { ...state, loadingLogin: true, errorLogin: null }; // error: null trong trường error đang báo lỗi, nhấn đăng nhập lại thì cần reset lại không báo lỗi nữa
    }
    case LOGIN_SUCCESS: {
      const { data, token } = action;
      localStorage.setItem(USER_LOGIN, JSON.stringify(data, token));
      localStorage.setItem(TOKEN, token);
      return { ...state, currentUser: data, loadingLogin: false };
    }

    case "LOGIN_FIREBASE": {
      const { data, token } = action.payload;
      localStorage.setItem(USER_LOGIN, JSON.stringify(data, token));
      localStorage.setItem(TOKEN, token);
      return { ...state, currentUser: data, loadingLogin: false };
    }

    case LOGIN_FAIL: {
      return {
        ...state,
        errorLogin: action.payload.error,
        loadingLogin: false,
      };
    }
    case LOGOUT: {
      localStorage.removeItem(USER_LOGIN);
      localStorage.removeItem(TOKEN);
      const auth = getAuth();
      signOut(auth);
      return {
        ...state,
        currentUser: null,
        responseRegister: null,
      };
    }
    case REGISTER_REQUEST: {
      return { ...state, loadingRegister: true, errorRegister: null };
    }
    case REGISTER_SUCCESS: {
      return {
        ...state,
        responseRegister: action.payload.data,
        loadingRegister: false,
      };
    }
    case REGISTER_FAIL: {
      return {
        ...state,
        errorRegister: action.payload.error,
        loadingRegister: false,
      };
    }

    case RESET_PASSWORD_REQUEST: {
      return { ...state, loadingResetPassword: true, errorResetPassword: null };
    }
    case RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        responseResetPassword: action.payload.data,
        loadingResetPassword: false,
      };
    }
    case RESET_PASSWORD_FAIL: {
      return {
        ...state,
        errorResetPassword: action.payload.error,
        loadingResetPassword: false,
      };
    }

    case FORGOT_PASSWORD_REQUEST: {
      return {
        ...state,
        loadingForgotPassword: true,
        errorForgotPassword: null,
      };
    }
    case FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        responseForgotPassword: action.payload.data,
        loadingForgotPassword: false,
      };
    }
    case FORGOT_PASSWORD_FAIL: {
      return {
        ...state,
        errorForgotPassword: action.payload.error,
        loadingForgotPassword: false,
      };
    }

    case UPDATE_USER_CURRENT_REQUEST: {
      return {
        ...state,
        loadingUpdateUserCurrent: true,
        errorUpdateUserCurrent: null,
        successUpdateUserCurrent: null,
      };
    }
    case UPDATE_USER_CURRENT_SUCCESS: {
      const { data, token, status } = action.payload;
      localStorage.setItem(USER_LOGIN, JSON.stringify(data, token));
      localStorage.setItem(TOKEN, token);
      return {
        ...state,
        loadingUpdateUserCurrent: false,
        successUpdateUserCurrent: status,
        errorUpdateUserCurrent: null,
        currentUser: data,
      };
    }
    case UPDATE_USER_CURRENT_FAIL: {
      return {
        ...state,
        loadingUpdateUserCurrent: false,
        errorUpdateUserCurrent: action.payload.error,
        successUpdateUserCurrent: null,
      };
    }
    case GET_USER_SUCCESS_REQUEST: {
      return { ...state, loadingGetDetailUser: true, errorGetDetailUser: null };
    }
    case GET_USER_SUCCESS: {
      return {
        ...state,
        successGetDetailUser: action.payload.data,
        loadingGetDetailUser: false,
      };
    }
    case GET_USER_FAIL: {
      return {
        ...state,
        errorGetDetailUser: action.payload.error,
        loadingGetDetailUser: false,
      };
    }
    case GET_CURRENT_USER_REQUEST: {
      return {
        ...state,
        loadingCurrentUserLogin: true,
        errorCurrentUserLogin: null,
      };
    }
    case GET_CURRENT_USER_SUCCESS: {
      return {
        ...state,
        currentUserLogin: action.payload.data,
        loadingCurrentUserLogin: false,
      };
    }
    case GET_CURRENT_USER_FAIL: {
      return {
        ...state,
        errorCurrentUserLogin: action.payload.error,
        loadingCurrentUserLogin: false,
      };
    }
    case RESET_CURRENT_USER: {
      return {
        ...state,
        successGetDetailUser: "",
      };
    }
    case RESET_UPDATE: {
      return {
        ...state,
        successUpdateUserCurrent: "",
        errorUpdateUserCurrent: null,
        successGetDetailUser: "",
      };
    }

    case RESET_AUTH: {
      return {
        ...state,
        loadingLogin: false,
        errorLogin: null,

        responseRegister: "",
        loadingRegister: false,
        errorRegister: null,

        responseResetPassword: "",
        loadingResetPassword: false,
        errorResetPassword: null,

        responseForgotPassword: null,
        loadingForgotPassword: false,
        errorForgotPassword: null,
      };
    }
    default:
      return { ...state };
  }
};
