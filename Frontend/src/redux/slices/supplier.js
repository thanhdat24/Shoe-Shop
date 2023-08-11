import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  newSupplier: null,
  error: null,
  success: '',
  supplierList: null,
};

const slice = createSlice({
  name: 'supplier',
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
    createSupplierSuccess(state, action) {
      state.isLoading = false;
      state.newSupplier = action.payload;
    },

    getSupplierSuccess(state, action) {
      state.isLoading = false;
      state.supplierList = action.payload;
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
    resetSupplier(state) {
      state.error = null;
      state.newSupplier = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetSupplier } = slice.actions;

// ----------------------------------------------------------------------

export function createSupplier(supplier) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/suppliers', supplier);
      dispatch(slice.actions.createSupplierSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSuppliers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/suppliers');
      dispatch(slice.actions.getSupplierSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
