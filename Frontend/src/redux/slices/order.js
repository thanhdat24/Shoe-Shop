import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  createOrderSuccess: null,
  error: null,
  success: '',
  orders: null,
  orderDetail: null,
  orderUpdate: null,
};

const slice = createSlice({
  name: 'order',
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

    // CRREATE ORDER
    createOrderSuccess(state, action) {
      state.isLoading = false;
      state.createOrderSuccess = action.payload;
    },
    // GET ALL ORDER
    getOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orders = action.payload;
    },
    // GET ORDER DETAIL SUCCESS
    getOrderDetailSuccess(state, action) {
      state.isLoading = false;
      state.orderDetail = action.payload;
    },
    updateOrderSuccess(state, action) {
      state.isLoading = false;
      state.orderUpdate = action.payload;
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

export function createOrder(newProduct) {
  return async () => {
    dispatch(slice.actions.startLoading());
    console.log('newProduct', newProduct);
    try {
      const response = await axios.post('/api/v1/orders', newProduct);
      console.log('response', response);
      dispatch(slice.actions.createOrderSuccess(response.data.data));
    } catch (error) {
      console.log('error123', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrders() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get('/api/v1/orders');
      console.log('response', response);
      dispatch(slice.actions.getOrdersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getOrderDetail(id) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get(`/api/v1/orders/${id}`);
      console.log('response', response);
      dispatch(slice.actions.getOrderDetailSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateOrder(id, updateorder) {
  console.log("hi")
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.put(`/api/v1/orders/${id}`, updateorder);
      console.log('response455', response);
      dispatch(slice.actions.updateOrderSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
