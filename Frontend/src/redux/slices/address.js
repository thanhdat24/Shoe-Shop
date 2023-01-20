import { createSlice } from '@reduxjs/toolkit';
import axiosMethod from 'axios';
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
  createAddressSuccess: '',
  deleteAddressSuccess: '',
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

    // CRREATE ADDRESS
    createAddressSuccess(state, action) {
      state.isLoading = false;
      state.createAddressSuccess = action.payload;
    },

    deleteAddressSuccess(state, action) {
      state.isLoading = false;
      state.deleteAddressSuccess = action.payload;
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
    resetAddress(state) {
      state.error = null;
      state.deleteAddressSuccess = '';
      state.createAddressSuccess = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetAddress } = slice.actions;

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

export function createAddress(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/address', data);
      dispatch(slice.actions.createAddressSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteAddress(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/address/${id}`);
      dispatch(slice.actions.deleteAddressSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListProvince(idProvince) {
  return axiosMethod.get(`https://sheltered-anchorage-60344.herokuapp.com/district?idProvince=${idProvince}`);
}

export function getListWard(idDistrict) {
  return axiosMethod.get(`https://sheltered-anchorage-60344.herokuapp.com/commune?idDistrict=${idDistrict}`);
}
