import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import sum from 'lodash/sum';
import uniqBy from 'lodash/uniqBy';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  bestSeller: null,
  products: [],
  cates: [],
  sizes: [],
  colors: [],
  productList: null,
  product: null,
  searchList: null,
  sortBy: null,
  successCreate: null,
  maxQuantity: false,
  filters: {
    gender: [],
    category: 'All',
    colors: [],
    priceRange: '',
    rating: '',
  },
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    address: null,
    idPromotion: null,
    payment: null,
  },
};

const slice = createSlice({
  name: 'product',
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

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    getAllProductSuccess(state, action) {
      state.isLoading = false;
      state.productList = action.payload;
    },
    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },
    getBestSellerSuccess(state, action) {
      state.isLoading = false;
      state.bestSeller = action.payload;
    },

    //  SORT & FILTER PRODUCTS
    sortByProducts(state, action) {
      state.sortBy = action.payload;
    },

    // }

    filterProducts(state, action) {
      state.filters.gender = action.payload.gender;
      state.filters.category = action.payload.category;
      state.filters.colors = action.payload.colors;
      state.filters.priceRange = action.payload.priceRange;
      state.filters.rating = action.payload.rating;
    },

    // CREATE PRODUCT
    createProductSuccess(state, action) {
      const newProduct = action.payload;
      state.isLoading = false;
      state.successCreate = [...state.successCreate, newProduct];
    },
    searchProductSuccess(state, action) {
      state.isLoading = false;
      state.searchList = action.payload;
    },
    searchGenderSuccess(state, action) {
      state.isLoading = false;
      state.searchList = action.payload;
    },
    // CATE
    // getAllCate(){
    getCateSuccess(state, action) {
      state.isLoading = false;
      state.cates = action.payload;
    },

    // SIZE
    getSizesSucess(state, action) {
      state.isLoading = false;
      state.sizes = action.payload;
    },

    // COLOR
    getColorsSuccess(state, action) {
      state.isLoading = false;
      state.colors = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((cartItem) => cartItem.price * cartItem.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const address = cart.length === 0 ? null : state.checkout.address;
      const payment = cart.length === 0 ? null : state.checkout.payment;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.address = address;
      state.checkout.payment = payment;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount;
    },

    addCart(state, action) {
      const product = action.payload;
      const isEmptyCart = state.checkout.cart.length === 0;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, product];
      } else {
        const indexCart = state.checkout.cart?.findIndex(
          (_product) =>
            _product.id === product.id &&
            Number(_product.size) === Number(product.size) &&
            _product.color === product.color
        );
        if (indexCart !== -1) {
          if (state.checkout.cart[indexCart].quantity >= state.checkout.cart[indexCart].available) {
            state.maxQuantity = true;
          } else {
            state.checkout.cart[indexCart].quantity += 1;
            state.maxQuantity = false;
          }
        } else {
          state.checkout.cart = [...state.checkout.cart, product];
          state.maxQuantity = false;
        }
      }
    },

    deleteCart(state, action) {
      const itemIndex = action.payload;
      const updateCart = state.checkout.cart.filter((item, index) => index !== itemIndex);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.address = null;
      state.checkout.payment = null;
      state.checkout.idPromotion = null;
    },

    resetProduct(state) {
      state.product = null;
    },

    resetMaxQuantity(state) {
      state.maxQuantity = false;
    },

    onBackStep(state) {
      state.checkout.activeStep -= 1;
    },

    onNextStep(state) {
      state.checkout.activeStep += 1;
    },

    onGotoStep(state, action) {
      const goToStep = action.payload;
      state.checkout.activeStep = goToStep;
    },

    increaseQuantity(state, action) {
      const itemIndex = action.payload;
      const updateCart = state.checkout.cart.map((product, index) => {
        if (index === itemIndex) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const itemIndex = action.payload;
      const updateCart = state.checkout.cart.map((product, index) => {
        if (index === itemIndex) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.address = action.payload;
    },

    createPaymentMethod(state, action) {
      state.checkout.payment = action.payload;
    },

    applyDiscount(state, action) {
      const { price, _id } = action.payload;

      if (state.checkout.subtotal > price) {
        state.checkout.discount = price;
        state.checkout.total = state.checkout.subtotal - price;
        state.checkout.idPromotion = _id;
      } else {
        state.checkout.discount = state.checkout.subtotal;
        state.checkout.total = 10000;
        state.checkout.idPromotion = _id;
      }
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + shipping;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  sortByProducts,
  filterProducts,
  resetProduct,
  resetMaxQuantity,
  createProductSuccess,
  createPaymentMethod,
} = slice.actions;

// ----------------------------------------------------------------------

// PRODUCT
export function getProducts(page) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/products/?page=${page}`);
      dispatch(slice.actions.getProductsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

// PRODUCT
export function getProduct(name) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/products/product/', {
        params: { name },
      });
      const groupByColors = _(response.data.data[0].productDetail)
        .groupBy((x) => x.idColor.color)
        .map((value, key) => ({ color: key, productDetail: value }))
        .value();

      const groupBySizes = _(response.data.data[0].productDetail)
        .groupBy((x) => x.idSize.name)
        .map((value, key) => ({ size: Number(key), productDetail: value }))
        .value();
      const colors = [];
      const sizes = [];
      const images = [];
      response.data.data[0].productImages[0].url.map((item) => images.push(item));
      groupByColors.map((item) => colors.push({ id: item.productDetail[0].idColor._id, color: item.color }));
      groupBySizes.map((item) => sizes.push({ id: item.productDetail[0].idSize._id, size: item.size }));
      response.data.data[0] = { ...response.data.data[0], colors, sizes, images };
      dispatch(slice.actions.getProductSuccess(response.data.data[0]));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
export function getAllProduct(page) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`/api/v1/products/?page=${page}`);
      dispatch(slice.actions.getAllProductSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getBestSeller() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/products/best-seller-products');
      dispatch(slice.actions.getBestSellerSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function createProduct(newProduct) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/v1/products', newProduct);
      // dispatch(slice.actions.createProductSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateProduct(product, id) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`/api/v1/products/id/${id}`, product);
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function searchProduct(search, page) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/products/search', { params: { search, page } });
      dispatch(slice.actions.searchProductSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function searchGender(search) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/products/search-gender', { params: { search } });
      dispatch(slice.actions.searchGenderSuccess(response.data.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
// Category
export function getAllCate() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/categories');
      dispatch(slice.actions.getCateSuccess(response.data.data));
    } catch (err) {
      console.log(err);
    }
  };
}

// Size
export function getAllSize() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/sizes');
      dispatch(slice.actions.getSizesSucess(response.data.data));
    } catch (err) {
      console.log(err);
    }
  };
}

// COLOR
export function getAllColor() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/v1/colors');
      dispatch(slice.actions.getColorsSuccess(response.data.data));
    } catch (err) {
      console.log(err);
    }
  };
}
