import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  successUpdateAdmin: null,
  loadingUpdateAdmin: false,
  errorUpdateAdmin: null,
  error: null,
  success: '',
  accountList: null,
  adminUpdate: null,
};

const slice = createSlice({
  name: 'admin',
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

    },

    // CRREATE ADMIN
    createAdminSuccess(state, action) {
      state.isLoading = false;
      state.newAccount = action.payload;
    },
    // UPDATE ADMIN
    updateCurrentSuccess(state, action) {
      const user = action.payload;

      state.isLoading = false;
      state.success = user;
    },
    updateAdminSuccess(state, action) {
      state.isLoading = false;
      state.adminUpdate = action.payload;
    },
    getAccountsSuccess(state, action) {
      state.isLoading = false;

      state.accountList = action.payload;
    },

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
    resetAdmin(state) {
      state.error = null;
      state.success = '';
      state.newAccount = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetAdmin } = slice.actions;

// ----------------------------------------------------------------------

export function createAdmin(account) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/auth/signup', account);
      dispatch(slice.actions.createAdminSuccess(response.data?.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCurrentUser(updateAdmin) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/v1/admin/updateMe', updateAdmin);
      dispatch(slice.actions.updateCurrentSuccess(response.data.user));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateAdmin(updateAdmin, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`api/v1/admin/${id}`, updateAdmin);
      dispatch(slice.actions.updateAdminSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/admin');
      dispatch(slice.actions.getAccountsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
