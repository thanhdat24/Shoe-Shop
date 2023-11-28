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
  objects: null,
  newObjectUse: null,
  newDiscount: null,
  updateObjectUseSuccess: null,
  deleteObjectUseSuccess: null,
};

const slice = createSlice({
  name: 'objectUse',
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
    createObjUseSuccess(state, action) {
      state.isLoading = false;
      state.newObjectUse = action.payload;
    },
    updateObjectUseSuccess(state, action) {
      state.isLoading = false;
      state.updateObjectUseSuccess = action.payload;
    },
    deleteObjectUseSuccess(state, action) {
      state.isLoading = false;
      state.deleteObjectUseSuccess = action.payload;
    },
    // UPDATE ADMIN
    updatePromotionSuccess(state, action) {
      state.isLoading = false;
      state.success = action.payload;
    },
    getObjectsSuccess(state, action) {
      state.isLoading = false;
      state.objects = action.payload;
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
    resetObjectUse(state) {
      state.error = null;
      state.newObjectUse = '';
      state.updateObjectUseSuccess = null;
      state.deleteObjectUseSuccess = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, selectEvent, resetObjectUse } = slice.actions;

// ----------------------------------------------------------------------

export function createObjUse(data) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/objectUses', data);
      dispatch(slice.actions.createObjUseSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function updateObjectUse(data, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/objectUses/${id}`, data);
      dispatch(slice.actions.updateObjectUseSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteObjectUse(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`/api/v1/ObjectUses/${id}`);
      console.log('response', response);
      dispatch(slice.actions.deleteObjectUseSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updatePromotion(updateDiscount, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`/api/v1/categories/${id}`, updateDiscount);
      dispatch(slice.actions.updatePromotionSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getObjects() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/objectUses');
      dispatch(slice.actions.getObjectsSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
