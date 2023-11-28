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
  updateCateSuccess: null,
  deleteCateSuccess: null,
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
    },

    // CRREATE ADMIN
    createCateSuccess(state, action) {
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

    updateCateSuccess(state, action) {
      state.isLoading = false;
      state.updateCateSuccess = action.payload;
    },
    deleteCateSuccess(state, action) {
      state.isLoading = false;
      state.deleteCateSuccess = action.payload;
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
      state.newCate = '';
      state.updateCateSuccess = '';
      state.deleteCateSuccess = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetCate } = slice.actions;

// ----------------------------------------------------------------------

export function createCate(promotion) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/categories', promotion);
      dispatch(slice.actions.createCateSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateCate(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/categories/${id}`, data);
      dispatch(slice.actions.updateCateSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteCate(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/categories/${id}`);
      console.log('response', response);
      dispatch(slice.actions.deleteCateSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getCates() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/categories');
      dispatch(slice.actions.getCatesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
