const express = require('express');
const cloudinaryRoutes = express.Router();
const bodyParser = express.json();
const cloudinaryService = require('./cloudinaryService');

cloudinaryRoutes
  .route('/')
  .post(bodyParser, (req, res, next) => {
    const knex = req.app.get('db');
    const { public_id, url, post_id } = req.body;
    const img = {
      post_id,
      public_id,
      url
    };
    
    cloudinaryService.postImageUrl(knex, img)
      .then(result => {
        res.status(201).send(result);
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const knex = req.app.get('db');
    cloudinaryService.getImages(knex)
      .then(images => {
        res.send(images);
      })
      .catch(next);
  });

module.exports = cloudinaryRoutes;