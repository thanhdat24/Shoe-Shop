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
  accountList:null,
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
      console.log('state', state);
      console.log('action', action);
    },

    // UPDATE ADMIN
    updateAdminSuccess(state, action) {
      const user = action.payload;

      state.isLoading = false;
      state.success = user;
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
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetAdmin } = slice.actions;

// ----------------------------------------------------------------------

export function updateCurrentUser(updateAdmin) {
  console.log('updateAdmin', updateAdmin);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put('/api/v1/admin/updateMe', updateAdmin);
      console.log('response', response);
      dispatch(slice.actions.updateAdminSuccess(response.data.user));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/admin');
      console.log('response', response);
      dispatch(slice.actions.getAccountsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
