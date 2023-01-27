const path = require('path');
const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

const authRouters = require('./routers/authRouters');
const adminRouters = require('./routers/adminRouters');
const userRouters = require('./routers/userRouters');
const categoryRouters = require('./routers/categoryRouters');
const brandRouters = require('./routers/brandRouters');
const objUseRouters = require('./routers/objectUseRouters');
const productRouters = require('./routers/productRouters');
const colorRouters = require('./routers/colorRouters');
const sizeRouters = require('./routers/sizeRouters');
const shipperRouters = require('./routers/shipperRouters');
const productDetailRouters = require('./routers/productDetailRouters');
const promotionRouters = require('./routers/promotionRouters');
const orderRouters = require('./routers/orderRouters');
const orderDetailRouters = require('./routers/orderDetailRouters');
const addressRouters = require('./routers/addressRouters');
const paymentRouters = require('./routers/paymentRouters');
const ratingRouters = require('./routers/ratingRouters');

// Serving static files
// const publicPathDirectory = path.join(__dirname, 'public')
app.use(express.static(path.join(__dirname, './public')));
// app.use(express.static(`${__dirname}/public`));

// 1) Global Middleware
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP. Please try again in an hour!',
});
app.use('/api', limiter);

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Router
app.use('/api/v1/auth', authRouters);
app.use('/api/v1/admin', adminRouters);
app.use('/api/v1/user', userRouters);
app.use('/api/v1/categories', categoryRouters);
app.use('/api/v1/brands', brandRouters);
app.use('/api/v1/shippers', shipperRouters);
app.use('/api/v1/objectUses', objUseRouters);
app.use('/api/v1/products', productRouters);
app.use('/api/v1/colors', colorRouters);
app.use('/api/v1/sizes', sizeRouters);
app.use('/api/v1/productDetail', productDetailRouters);
app.use('/api/v1/promotions', promotionRouters);
app.use('/api/v1/orders', orderRouters);
app.use('/api/v1/order-details', orderDetailRouters);
app.use('/api/v1/address', addressRouters);
app.use('/api/v1/payments', paymentRouters);
app.use('/api/v1/ratings', ratingRouters);

// trả về đường dẫn not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can'n find ${req.originalUrl} on this sever!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
