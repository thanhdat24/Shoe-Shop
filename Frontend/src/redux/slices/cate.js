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
  cates: null,
  newCate: null,
  newDiscount: null,
};

const slice = createSlice({
  name: 'cate',
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
    createCateSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newCate = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getCatesSuccess(state, action) {
      state.isLoading = false;
      state.cates = action.payload;
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
    resetCate(state) {
      state.error = null;
      state.newBrand = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetCate } = slice.actions;

// ----------------------------------------------------------------------

export function createCate(promotion) {
  console.log('createAdmin', promotion);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/categories', promotion);
      console.log('response234', response);
      dispatch(slice.actions.createCateSuccess(response.data.data));
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
      const response = await axios.put(`/api/v1/categories/${id}`, updateDiscount);
      console.log('response', response);
      dispatch(slice.actions.updatePromotionSuccess(response.data.data));
    } catch (error) {
      console.log('error', error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCates() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/categories');
      console.log('response', response);
      dispatch(slice.actions.getCatesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
