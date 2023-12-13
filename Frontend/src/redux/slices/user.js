import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,

  error: null,
  success: '',
  users: null,

  updateSuccess: null,

  updateUserSuccess: null,
  errorUpdateUser: null,
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.errorUpdateUser = action.payload;
    },

    getUsersSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },
    updateCurrentSuccess(state, action) {
      state.updateUserSuccess = action.payload;
      state.isLoading = false;
    },
    updateUserSuccess(state, action) {
      state.updateSuccess = action.payload;
      state.isLoading = false;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
    resetUser(state) {
      state.updateUserSuccess = null;
      state.updateSuccess = null;
      state.errorUpdateUser = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, getUsersSuccess, resetUser } = slice.actions;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/user');
      dispatch(slice.actions.getUsersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCurrentUser(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch('/api/v1/user/updateMe', data);
      console.log('response', response);
      dispatch(slice.actions.updateCurrentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUser(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/user/${id}`, data);
      console.log('response', response);
      dispatch(slice.actions.updateUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
