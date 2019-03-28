require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const postsRoutes = require('./posts/postsRoutes');
const userRoutes = require('./user/userRoutes');
const commentsRoutes = require('./comments/commentsRoutes');
const authRoutes = require('./auth/authRoutes');
const cloudinaryRoutes = require('./cloudinary/cloudinaryRoutes');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// http and current environment server middleware
app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(helmet());
app.use(cors());

// generic error handling
function errorHandler(req, res, error) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { message: error };
  }
  res.status(500).send(response);
}

// api middleware

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use(errorHandler);

module.exports = app;
