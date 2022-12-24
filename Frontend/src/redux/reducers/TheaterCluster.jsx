import {
  CREATE_THEATER_CLUSTER_FAIL,
  CREATE_THEATER_CLUSTER_REQUEST,
  CREATE_THEATER_CLUSTER_SUCCESS,
  DELETE_THEATER_CLUSTER_FAIL,
  DELETE_THEATER_CLUSTER_REQUEST,
  DELETE_THEATER_CLUSTER_SUCCESS,
  GET_THEATER_CLUSTER_FAIL,
  GET_THEATER_CLUSTER_LIST_FAIL,
  GET_THEATER_CLUSTER_LIST_REQUEST,
  GET_THEATER_CLUSTER_LIST_SUCCESS,
  GET_THEATER_CLUSTER_REQUEST,
  GET_THEATER_CLUSTER_SUCCESS,
  RESET_THEATER_CLUSTER,
  RESET_THEATER_CLUSTER_DETAIL,
  UPDATE_THEATER_CLUSTER_FAIL,
  UPDATE_THEATER_CLUSTER_REQUEST,
  UPDATE_THEATER_CLUSTER_SUCCESS,
} from "../constants/TheaterCluster";

const stateDefault = {
  theaterClusterList: [],
  loadingTheaterClusterList: false,
  errorTheaterClusterList: null,

  successDetailTheaterCluster: "",
  loadingDetailTheaterCluster: false,
  errorDetailTheaterCluster: null,

  loadingCreateTheaterCluster: false,
  successCreateTheaterCluster: null,
  errorCreateTheaterCluster: null,

  successDeleteTheaterCluster: "",
  loadingDeleteTheaterCluster: false,
  errorDeleteTheaterCluster: null,

  successUpdateTheaterCluster: "",
  loadingUpdateTheaterCluster: false,
  errorUpdateTheaterCluster: null,
};

export const TheaterClusterReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case GET_THEATER_CLUSTER_LIST_REQUEST: {
      return {
        ...state,
        loadingTheaterClusterList: true,
        errorTheaterClusterList: null,
        theaterClusterList: null,
      };
    }
    case GET_THEATER_CLUSTER_LIST_SUCCESS: {
      return {
        ...state,
        theaterClusterList: action.payload.data,
        loadingTheaterClusterList: false,
      };
    }
    case GET_THEATER_CLUSTER_LIST_FAIL: {
      return {
        ...state,
        errorTheaterClusterList: action.payload.error,
        loadingTheaterClusterList: false,
      };
    }

    case GET_THEATER_CLUSTER_REQUEST: {
      return {
        ...state,
        loadingDetailTheaterCluster: true,
        errorDetailTheaterCluster: null,
        successDetailTheaterCluster: "",
      };
    }
    case GET_THEATER_CLUSTER_SUCCESS: {
      return {
        ...state,
        loadingDetailTheaterCluster: false,
        successDetailTheaterCluster: action.payload.data,
        errorDetailTheaterCluster: null,
      };
    }
    case GET_THEATER_CLUSTER_FAIL: {
      return {
        ...state,
        loadingDetailTheaterCluster: false,
        errorDetailTheaterCluster: action.payload.error,
        successDetailTheaterCluster: "",
      };
    }

    case CREATE_THEATER_CLUSTER_REQUEST: {
      return {
        ...state,
        loadingCreateTheaterCluster: true,
        errorCreateTheaterCluster: null,
      };
    }
    case CREATE_THEATER_CLUSTER_SUCCESS: {
      return {
        ...state,
        successCreateTheaterCluster: action.payload.data,
        loadingCreateTheaterCluster: false,
      };
    }
    case CREATE_THEATER_CLUSTER_FAIL: {
      return {
        ...state,
        errorDeleteTheaterCluster: action.payload.error,
        loadingDeleteTheaterCluster: false,
      };
    }

    case DELETE_THEATER_CLUSTER_REQUEST: {
      return {
        ...state,
        loadingDeleteTheaterCluster: true,
        errorDeleteTheaterCluster: null,
        successDeleteTheaterCluster: "",
      };
    }
    case DELETE_THEATER_CLUSTER_SUCCESS: {
      return {
        ...state,
        loadingDeleteTheaterCluster: false,
        successDeleteTheaterCluster: action.payload.data,
        errorDeleteTheaterCluster: null,
      };
    }
    case DELETE_THEATER_CLUSTER_FAIL: {
      return {
        ...state,
        loadingDeleteTheaterCluster: false,
        errorDeleteTheaterCluster: action.payload.error,
        successDeleteTheaterCluster: "",
      };
    }

    case UPDATE_THEATER_CLUSTER_REQUEST: {
      return {
        ...state,
        loadingUpdateTheaterCluster: true,
        errorUpdateTheaterCluster: null,
        successUpdateTheaterCluster: "",
      };
    }
    case UPDATE_THEATER_CLUSTER_SUCCESS: {
      return {
        ...state,
        loadingUpdateTheaterCluster: false,
        successUpdateTheaterCluster: action.payload.data,
        errorUpdateTheaterCluster: null,
      };
    }
    case UPDATE_THEATER_CLUSTER_FAIL: {
      return {
        ...state,
        loadingUpdateTheaterCluster: false,
        errorUpdateTheaterCluster: action.payload.error,
        successUpdateTheaterCluster: "",
      };
    }

    case RESET_THEATER_CLUSTER_DETAIL: {
      return {
        ...state,
        successDetailTheaterCluster: "",
        loadingDetailTheaterCluster: false,
        errorDetailTheaterCluster: null,
      };
    }

    case RESET_THEATER_CLUSTER: {
      state.loadingCreateTheaterCluster = false;
      state.successCreateTheaterCluster = null;
      state.errorCreateTheaterCluster = null;

      state.loadingDeleteTheaterCluster = false;
      state.successDeleteTheaterCluster = null;
      state.errorDeleteTheaterCluster = null;

      state.successUpdateTheaterCluster = null;
      state.loadingUpdateTheaterCluster = false;
      state.errorUpdateTheaterCluster = null;
      return state;
    }
    default:
      return { ...state };
  }
};
