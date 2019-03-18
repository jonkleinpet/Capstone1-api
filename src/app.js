require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, API_KEY } = require('./config');
const postsRoutes = require('./posts/postsRoutes');
const authRoutes = require('./auth/authRoutes');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// http and current environment server middleware
app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(helmet());
app.use(cors());

// generic error handling
function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
}

// api middleware

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use(errorHandler);

module.exports = app;
