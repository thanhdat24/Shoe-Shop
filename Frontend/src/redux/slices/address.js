import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  address: null,
  error: null,
  success: '',
};

const slice = createSlice({
  name: 'address',
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

    // CRREATE ADMIN
    createBrandSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newBrand = action.payload;
    },

    getAddressSuccess(state, action) {
      state.isLoading = false;
      state.address = action.payload;
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
    resetBrand(state) {
      state.error = null;
      state.newBrand = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetBrand } = slice.actions;

// ----------------------------------------------------------------------

export function getAddress() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/address/getMeAddress');
        dispatch(slice.actions.getAddressSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
