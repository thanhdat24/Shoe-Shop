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
  accessToken: null,
};

const slice = createSlice({
  name: 'shipperManage',
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
      console.log('state', state);
      console.log('action', action);
    },
    loginSuccess(state, action) {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', state.accessToken);
    },
    // CRREATE ADMIN
    createAdminSuccess(state, action) {
      console.log('action', action.payload);
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
  console.log('createAdmin', account);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/auth/signup', account);
      console.log('response', response);
      dispatch(slice.actions.createAdminSuccess(response.data?.user));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCurrentUser(updateAdmin) {
  console.log('updateAdmin', updateAdmin);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/v1/admin/updateMe', updateAdmin);
      console.log('response', response);
      dispatch(slice.actions.updateCurrentSuccess(response.data.user));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateAdmin(updateAdmin, id) {
  console.log('updateAdmin', updateAdmin);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`api/v1/admin/${id}`, updateAdmin);
      console.log('response', response);
      dispatch(slice.actions.updateAdminSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function login(value) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/shippers/login-shipper', value);
      dispatch(slice.actions.loginSuccess(response.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
