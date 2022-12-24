import theatersClusterApi from "../../api/theatersClusterApi";
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
  UPDATE_THEATER_CLUSTER_FAIL,
  UPDATE_THEATER_CLUSTER_REQUEST,
  UPDATE_THEATER_CLUSTER_SUCCESS,
} from "../constants/TheaterCluster";

export const getTheaterClusterList = () => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_THEATER_CLUSTER_LIST_REQUEST,
      });
      const result = await theatersClusterApi.getTheaterClusterList();
      dispatch({
        type: GET_THEATER_CLUSTER_LIST_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_THEATER_CLUSTER_LIST_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const getDetailTheaterCluster = (_id) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: GET_THEATER_CLUSTER_REQUEST,
      });
      const result = await theatersClusterApi.getDetailTheaterCluster(_id);
      dispatch({
        type: GET_THEATER_CLUSTER_SUCCESS,
        payload: {
          data: result.data.data,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_THEATER_CLUSTER_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const createTheaterCluster = (data) => {
  return async (dispatch) => {
    try {
      dispatch({
        type: CREATE_THEATER_CLUSTER_REQUEST,
      });
      const result = await theatersClusterApi.postCreateTheaterCluster(data);
      dispatch({
        type: CREATE_THEATER_CLUSTER_SUCCESS,
        payload: {
          data: result.data,
        },
      });
    } catch (error) {
      dispatch({
        type: CREATE_THEATER_CLUSTER_FAIL,
        payload: {
          error: error.response?.data.message,
        },
      });
    }
  };
};

export const deleteTheaterCluster = (_id) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_THEATER_CLUSTER_REQUEST,
    });
    theatersClusterApi
      .deleteTheaterCluster(_id)
      .then((result) => {
        dispatch({
          type: DELETE_THEATER_CLUSTER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: DELETE_THEATER_CLUSTER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};

export const updateTheaterCluster = (theaterCluster, _id) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_THEATER_CLUSTER_REQUEST,
    });
    theatersClusterApi
      .updateTheaterCluster(theaterCluster, _id)
      .then((result) => {
        dispatch({
          type: UPDATE_THEATER_CLUSTER_SUCCESS,
          payload: {
            data: result.data.data,
          },
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_THEATER_CLUSTER_FAIL,
          payload: {
            error: error.response?.data.message,
          },
        });
      });
  };
};
export const resetCreateTheaterCluster = () => {
  return (dispatch) => {
    dispatch({
      type: RESET_THEATER_CLUSTER,
    });
  };
};
