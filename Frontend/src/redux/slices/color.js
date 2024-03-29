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
  updateColorSuccess: null,
  deleteColorSuccess: null,
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
    },

    // CRREATE ADMIN
    createColorSuccess(state, action) {
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
    updateColorSuccess(state, action) {
      state.isLoading = false;
      state.updateColorSuccess = action.payload;
    },
    deleteColorSuccess(state, action) {
      state.isLoading = false;
      state.deleteColorSuccess = action.payload;
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
      state.newColor = null;
      state.updateColorSuccess = null;
      state.deleteColorSuccess = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetColor } = slice.actions;

// ----------------------------------------------------------------------

export function createColor(color) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/colors', color);
      dispatch(slice.actions.createColorSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateColor(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/colors/${id}`, data);
      dispatch(slice.actions.updateColorSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteColor(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/colors/${id}`);
      console.log('response', response);
      dispatch(slice.actions.deleteColorSuccess(response.data.data));
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

export function getColors() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/colors');
      dispatch(slice.actions.getColorsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
