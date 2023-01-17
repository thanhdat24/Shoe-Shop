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
  shippers: null,
  newAccount: null,
  newShipper: null,
  shipperDetail: null,
  promotionDetail: null,
  orderShipper: null,
};

const slice = createSlice({
  name: 'shipper',
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
    createShipperSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newShipper = action.payload;
    },

    getShippersSuccess(state, action) {
      state.isLoading = false;
      state.shippers = action.payload;
    },
    getShipperDetailSuccess(state, action) {
      state.isLoading = false;
      state.shipperDetail = action.payload;
    },

    getOrderShipperSuccess(state, action) {
      state.isLoading = false;
      state.orderShipper = action.payload;
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
    resetShipper(state) {
      state.error = null;
      state.newShipper = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetShipper } = slice.actions;

// ----------------------------------------------------------------------

export function createShipper(color) {
  console.log('createAdmin', color);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/shippers', color);
      console.log('response234', response);
      dispatch(slice.actions.createShipperSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getShippers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/shippers');
      console.log('response', response);
      dispatch(slice.actions.getShippersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getShipperDetail(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/shippers/${id}`);
      console.log('response', response);
      dispatch(slice.actions.getShipperDetailSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrderByShipper() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/shippers/order-shipper');
      dispatch(slice.actions.getOrderShipperSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}
