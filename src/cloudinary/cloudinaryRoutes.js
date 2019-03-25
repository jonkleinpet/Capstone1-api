const express = require('express');
const cloudinaryRoutes = express.Router();
const bodyParser = express.json();
const cloudinaryService = require('./cloudinaryService');

cloudinaryRoutes
  .route('/')
  .post(bodyParser, (req, res, next) => {
    const knex = req.app.get('db');
    console.log(req.body)
    const { public_id, url } = req.body;
    const img = {
      public_id,
      url
    };
    console.log(img)
    cloudinaryService.postImageUrl(knex, img)
      .then(result => {
        console.log(result);
        res.status(201).send(result);
      });
  })
  .get((req, res, next) => {
    const knex = req.app.get('db');
    cloudinaryService.getImages(knex)
      .then(images => {
        res.status(200).send(images);
      });
  });

module.exports = cloudinaryRoutes;