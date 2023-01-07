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
  colors: null,
  newAccount: null,
  newColor: null,
  promotionDetail: null,
};

const slice = createSlice({
  name: 'color',
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
    createColorSuccess(state, action) {
      console.log('action', action.payload);
      state.isLoading = false;
      state.newColor = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getColorsSuccess(state, action) {
      state.isLoading = false;
      state.colors = action.payload;
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
    resetColor(state) {
      state.error = null;
      state.newColor = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetColor } = slice.actions;

// ----------------------------------------------------------------------

export function createColor(color) {
  console.log('createAdmin', color);
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/colors', color);
      console.log('response234', response);
      dispatch(slice.actions.createColorSuccess(response.data.data));
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

export function getColors() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/colors');
      console.log('response', response);
      dispatch(slice.actions.getColorsSuccess(response.data.data));
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
