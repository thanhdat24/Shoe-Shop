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
  orderUser: null,
  orderDetail: null,
  orderUpdate: null,
  staticProductDetail: null,
  staticProductDetailMonth: null,
  bestSellingProducts: null,
  totalRevenue: null,
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

    getMeOrdersSuccess(state, action) {
      state.isLoading = false;
      state.orderUser = action.payload;
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

    getStaticProductDetailYearSuccess(state, action) {
      state.isLoading = false;
      state.staticProductDetail = action.payload;
    },
    getStaticProductDetailMonthSuccess(state, action) {
      state.isLoading = false;
      state.staticProductDetailMonth = action.payload;
    },
    bestSellingProductsRevenueSuccess(state, action) {
      state.isLoading = false;
      state.bestSellingProducts = action.payload;
    },
    getTotalRevenueSuccess(state, action) {
      state.isLoading = false;
      state.totalRevenue = action.payload;
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
    resetOrder(state) {
      state.error = null;
      state.orderUpdate = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetOrder } = slice.actions;

// ----------------------------------------------------------------------

export function createOrder(newProduct) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/orders', newProduct);
      dispatch(slice.actions.createOrderSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getOrders() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get('/api/v1/orders');
      dispatch(slice.actions.getOrdersSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getMeOrder() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/orders/getMeOrder');
      dispatch(slice.actions.getMeOrdersSuccess(response.data.data));
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
      dispatch(slice.actions.getOrderDetailSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateOrder(id, updateOrder) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.put(`/api/v1/orders/${id}`, updateOrder);
      dispatch(slice.actions.updateOrderSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getStaticProductDetailYear(id) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get(`/api/v1/orders/yearly-product-revenue/${id}`);
      dispatch(slice.actions.getStaticProductDetailYearSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getStaticProductDetailMonth(id) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get(`/api/v1/orders/monthly-product-revenue/${id}`);
      dispatch(slice.actions.getStaticProductDetailMonthSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function bestSellingProductsRevenue() {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.get('/api/v1/orders/best-selling-products-revenue');
      dispatch(slice.actions.bestSellingProductsRevenueSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getTotalRevenue() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/orders/totalRevenue');
      dispatch(slice.actions.getTotalRevenueSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
