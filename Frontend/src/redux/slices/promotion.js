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
  promotions: null,
  newAccount: null,
  newDiscount: null,
  promotionDetail:null
};

const slice = createSlice({
  name: 'promotion',
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
    createDiscountSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newDiscount = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getPromotionsSuccess(state, action) {
      state.isLoading = false;
      state.promotions = action.payload;
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
    resetDiscount(state) {
      state.error = null;
      state.newDiscount = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetDiscount } = slice.actions;

// ----------------------------------------------------------------------

export function createDiscount(promotion) {
  console.log('createAdmin', promotion);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/promotions', promotion);
      console.log('response234', response);
      dispatch(slice.actions.createDiscountSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updatePromotion(updateDiscount,id) {
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

export function getPromotions() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/promotions');
      console.log('response', response);
      dispatch(slice.actions.getPromotionsSuccess(response.data.data));
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
