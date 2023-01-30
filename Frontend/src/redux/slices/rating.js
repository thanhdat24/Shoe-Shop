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

  ratingList: [],
  productRatingList: null,
  content: [],
  imageRating: [],

  successRating: null,
};

const slice = createSlice({
  name: 'rating',
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

    // OPEN MODAL
    openModal(state) {
      state.isOpenModal = true;
    },

    // CREATE RATING
    createRatingSuccess(state, action) {
      state.isLoading = false;
      state.successRating = action.payload;
    },

    // CREATE RATING
    getProductRatingSuccess(state, action) {
      state.isLoading = false;
      state.productRatingList = action.payload;
    },

    changeRating(state, action) {
      //   const dataRating = action.payload;
      const { rating, idProduct, content, imageRating, resetRatingList } = action.payload;
      const isEmptyRatingList = state.ratingList.length === 0;
      if (resetRatingList === '') {
        state.ratingList = [];
      } else if (isEmptyRatingList) {
        state.ratingList = [...state.ratingList, action.payload];
      } else {
        const index = state.ratingList.findIndex((item) => item.idProduct === idProduct);
        if (index !== -1) {
          state.ratingList[index].rating = rating;
          state.ratingList[index].content = content;
          state.ratingList[index].imageRating = imageRating;
        } else {
          state.ratingList = [...state.ratingList, action.payload];
        }
      }

      state.ratingList = [...state.ratingList];
      // if (index !== -1) {
      //   if (rating !== '') {
      //     state.ratingList[index].rating = rating;
      //   }
      //   if (content !== '') {
      //     state.ratingList[index].content = content;
      //   }
      //   if (imageRating !== '') {
      //     state.ratingList[index].imageRating = imageRating;
      //   }
      // } else {
      //   state.ratingList.push(action.payload);
      // }
      // state.ratingList = [...state.ratingList];
      //   state.content = [...state.content];
      //   state.imageRating = [...state.imageRating];
    },

    // CLOSE MODAL
    closeModal(state) {
      state.isOpenModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { openModal, closeModal, resetBrand, changeRating, getProductRatingSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function createRating(ratingList) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {

      const response = await axios.post('/api/v1/ratings', ratingList);
      dispatch(slice.actions.createRatingSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getProductRating(id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/ratings/product-rating/${id}`);
      dispatch(slice.actions.getProductRatingSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
