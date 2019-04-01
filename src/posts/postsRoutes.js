const express = require('express');
const postsRoutes = express.Router();
const postsService = require('./postsService');
const bodyParser = express.json();
const isError = require('../../validation/postsValidation/isError');
const foundPosts = require('../../validation/postsValidation/foundPosts');
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

// DELETE a blog post
postsRoutes
  .route('/blog/:id')
  .delete((req, res, next) => {
    const { id } = req.params;
    const knex = req.app.get('db');
    postsService.deletePost(knex, id)
      .then(id => {
        res.status(200).send({ id });
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { content, title } = req.body;
    const { id } = req.params;
    const knex = req.app.get('db');
    console.log(req.body);
    const editedPost = {
      title,
      content
    };
    postsService.editPost(knex, editedPost, id)
      .then(post => {
        res.status(201).send(post);
      });
  });




module.exports = postsRoutes;