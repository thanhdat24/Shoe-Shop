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
const categoryRouters = require('./routers/categoryRouters');
const brandRouters = require('./routers/brandRouters');;
const objUseRouters = require('./routers/objectUseRouters');

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
app.use('/api/v1/categories', categoryRouters);
app.use('/api/v1/brands', brandRouters);
app.use('/api/v1/objectUses', objUseRouters);

// trả về đường dẫn not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can'n find ${req.originalUrl} on this sever!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
