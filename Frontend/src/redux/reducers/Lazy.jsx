import {
  LOADING_BACKTO_HOME,
  LOADING_BACKTO_HOME_COMPLETED,
  LOADING_LAZY_MOUNT,
  LOADING_LAZY_UNMOUNT,
} from "../constants/Lazy";

const initialState = {
  isLazy: false, // hiện loading khi đang tải component về máy
  isLoadingBackToHome: false, // hiện loading khi chuyển  từ component khác về component home
};

const LazyReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_LAZY_MOUNT: {
      return {
        ...state,
        isLazy: true,
      };
    }
    case LOADING_LAZY_UNMOUNT: {
      return {
        ...state,
        isLazy: false,
      };
    }
    case LOADING_BACKTO_HOME: {
      return {
        ...state,
        isLoadingBackToHome: true,
      };
    }
    case LOADING_BACKTO_HOME_COMPLETED: {
      return {
        ...state,
        isLoadingBackToHome: false,
      };
    }
    default:
      return state;
  }
};
export default LazyReducer;
