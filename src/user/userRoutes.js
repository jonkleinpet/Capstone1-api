const express = require('express');
const userRoutes = express.Router();
const userService = require('./userService');
const bodyParser = express.json();

module.exports = userRoutes;