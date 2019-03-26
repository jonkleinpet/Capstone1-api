const express = require('express');
const postsRoutes = express.Router();
const postsService = require('./postsService');
const bodyParser = express.json();
const isError = require('../../validation/isError');
const foundPosts = require('../../validation/foundPosts');
const findPost = require('../../validation/findPost');
const requireAuth = require('../auth/jwt-auth').requireAuth;

// GET all blog posts
postsRoutes
  .route('/')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    postsService.getAllPosts(knex)
      
      .then(posts => {
        foundPosts(posts)
          ? res.send(posts)
          : res.status(404).send({ message: 'Cannot find posts' });
      })
      .then(next);
  });

// POST a blog
postsRoutes
  .route('/blog')
  .all(requireAuth)
  .post(bodyParser, (req, res, next) => {
    const knex = req.app.get('db');
    const data = req.body;
    isError(data)
      ? res.status(400).send({ message: 'Content required' }) 
      : postsService.createPost(knex, data)
        .then(post => {
          res.status(201).send(post);
        })
        .then(next);
  });

// GET a single blog post
postsRoutes
  .route('/:id')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    const { id } = req.params;
    postsService.getPost(knex, parseInt(id))
      .then(result => {
        findPost(result)
          ? res.status(200).send(result)
          : res.status(404).send({ message: 'Cannot find blog post' });
      })
      .then(next);
  });


module.exports = postsRoutes;