import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import adminReducer from './slices/admin';
import promotionReducer from './slices/promotion';
import brandReducer from './slices/brand';
import colorReducer from './slices/color';
import sizeReducer from './slices/size';
import shipperReducer from './slices/shipper';
import cateReducer from './slices/cate';
import objectUseReducer from './slices/objectUse';
import addressReducer from './slices/address';
import paymentReducer from './slices/payment';
import orderReducer from './slices/order';
import ratingReducer from './slices/rating';
import supplierReducer from './slices/supplier';
import notificationReducer from './slices/notification';
import userReducer from './slices/user';
import receiptReducer from './slices/receipt';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  product: persistReducer(productPersistConfig, productReducer),
  admin: adminReducer,
  promotion: promotionReducer,
  brand: brandReducer,
  color: colorReducer,
  size: sizeReducer,
  shipper: shipperReducer,
  cate: cateReducer,
  objectUse: objectUseReducer,
  address: addressReducer,
  payment: paymentReducer,
  order: orderReducer,
  rating: ratingReducer,
  supplier: supplierReducer,
  notification: notificationReducer,
  user: userReducer,
  receipt: receiptReducer,
});

export { rootPersistConfig, rootReducer };
