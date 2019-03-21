const express = require('express');
const adminRoutes = express.Router();
const bodyParser = express.json();
const adminService = require('./adminService');

adminRoutes
  .route('/blog')
  .post(bodyParser, (req, res, next) => {
    const knex = req.app.get('db');
    const { content } = req.body;
    adminService.postBlog(knex, content)
  })

module.exports = adminRoutes;