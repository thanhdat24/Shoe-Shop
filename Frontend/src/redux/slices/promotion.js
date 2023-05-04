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
  promotionDetail: null,
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
    },

    // CRREATE ADMIN
    createDiscountSuccess(state, action) {
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
      state.success = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetDiscount } = slice.actions;

// ----------------------------------------------------------------------

export function createDiscount(promotion) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/promotions', promotion);
      dispatch(slice.actions.createDiscountSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updatePromotion(updateDiscount, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/promotions/${id}`, updateDiscount);
      dispatch(slice.actions.updatePromotionSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getPromotions() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/promotions');
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
      dispatch(slice.actions.getPromotionDetailSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
