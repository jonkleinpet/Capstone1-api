require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV, API_KEY } = require('./config');
const postsRoutes = require('./posts/postsRoutes');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(helmet());
app.use(cors());

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

function apiValidation(req, res, next) {
  const apiToken = API_KEY;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
}

app.use(errorHandler);
app.use(apiValidation);

app.use('/api/posts', postsRoutes);

module.exports = app;
