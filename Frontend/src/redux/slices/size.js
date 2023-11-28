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
  updateSizeSuccess: null,
  deleteSizeSuccess: null,
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
    },

    // CRREATE ADMIN
    createSizeSuccess(state, action) {
      state.isLoading = false;
      state.newSize = action.payload;
    },
    updateSizeSuccess(state, action) {
      state.isLoading = false;
      state.updateSizeSuccess = action.payload;
    },
    deleteSizeSuccess(state, action) {
      state.isLoading = false;
      state.deleteSizeSuccess = action.payload;
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
      state.updateSizeSuccess = '';
      state.deleteSizeSuccess = '';
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetSize } = slice.actions;

// ----------------------------------------------------------------------

export function createSize(color) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/sizes', color);
      dispatch(slice.actions.createSizeSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateSize(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/sizes/${id}`, data);
      dispatch(slice.actions.updateSizeSuccess(response.data.data));
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
export function deleteSize(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/sizes/${id}`);
      console.log('response', response);
      dispatch(slice.actions.deleteSizeSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getSizes() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/sizes');
      dispatch(slice.actions.getSizesSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
