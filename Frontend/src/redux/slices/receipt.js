import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  newReceipt: null,
  error: null,
  success: '',
  receiptList: [],
  detailReceipt: null,
};

const slice = createSlice({
  name: 'receipt',
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
    createReceiptSuccess(state, action) {
      state.isLoading = false;
      state.newReceipt = action.payload;
    },

    getReceiptSuccess(state, action) {
      state.isLoading = false;
      state.receiptList = action.payload;
    },
    getDetailReceiptSuccess (state, action) {
      state.isLoading = false;
      state.detailReceipt = action.payload;
    },
    resetReceipt(state) {
      state.error = null;
      state.newReceipt = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { createReceiptSuccess, resetReceipt } = slice.actions;

// ----------------------------------------------------------------------

export function createReceipt(receipt) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/receipts', receipt);
      dispatch(slice.actions.createReceiptSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}


export function getReceipts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/receipts');
      dispatch(slice.actions.getReceiptSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}



export function getDetailReceipts(receiptCode) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/receipts/${receiptCode}`);
      dispatch(slice.actions.getDetailReceiptSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
