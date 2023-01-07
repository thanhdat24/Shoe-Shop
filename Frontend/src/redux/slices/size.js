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
  sizes: null,

  newSize: null,
  promotionDetail: null,
};

const slice = createSlice({
  name: 'size',
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
    createSizeSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newSize = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getSizesSuccess(state, action) {
      state.isLoading = false;
      state.sizes = action.payload;
    },

    getPromotionDetailSuccess(state, action) {
      state.isLoading = false;
      state.promotionDetail = action.payload;
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
    resetSize(state) {
      state.error = null;
      state.newSize = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetSize } = slice.actions;

// ----------------------------------------------------------------------

export function createSize(color) {
  console.log('createAdmin', color);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/sizes', color);
      console.log('response234', response);
      dispatch(slice.actions.createSizeSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updatePromotion(updateDiscount, id) {
  console.log('updateDiscount', updateDiscount);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/promotions/${id}`, updateDiscount);
      console.log('response', response);
      dispatch(slice.actions.updatePromotionSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSizes() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/sizes');
      console.log('response', response);
      dispatch(slice.actions.getSizesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getPromotionDetail(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/promotions/${id}`);
      console.log('response', response);
      dispatch(slice.actions.getPromotionDetailSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
