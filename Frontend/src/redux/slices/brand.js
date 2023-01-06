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
  brandList: null,
  newBrand: null,
  newDiscount: null,
};

const slice = createSlice({
  name: 'brand',
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
    createBrandSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newBrand = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getBrandsSuccess(state, action) {
      state.isLoading = false;
      state.brandList = action.payload;
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

export function createBrand(promotion) {
  console.log('createAdmin', promotion);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/brands', promotion);
      console.log('response234', response);
      dispatch(slice.actions.createBrandSuccess(response.data.data));
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

export function getBrands() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/brands');
      console.log('response', response);
      dispatch(slice.actions.getBrandsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
