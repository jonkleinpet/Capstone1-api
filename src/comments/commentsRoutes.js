const express = require('express');
const commentsRoutes = express.Router();
const commentService = require('./commentService');
const authService = require('../auth/authService');
const bodyParser = express.json();

commentsRoutes
  .route('/')
  .get((req, res, next) => {
    const knex = req.app.get('db');
    commentService.getPostComments(knex)
      .then(comments => {
        return commentService.getUserName(knex)
          .then(user => {
            return res
              .status(200)
              .send({
                comments,
                user
              });
          });
      })
      .catch(next);
  })
  
  .post(bodyParser, (req, res, next) => {
    const token = req.headers.authorization;
    const user_id = authService.getUserId(token);
    const { content, post_id } = req.body;
    const newComment = {
      post_id,
      user_id,
      content
    };
    const knex = req.app.get('db');
    commentService.postComment(knex, newComment)
      .then(comment => {
        res.status(201).json(commentService.serializeComments(comment));
      })
      .catch(next);
  });

commentsRoutes
  .route('/:comment_id')
  .delete((req, res) => {
    const knex = req.app.get('db');
    const { comment_id } = req.params;
    commentService.deleteComment(knex, comment_id)
      .then(comment_id => res.status(200).send({ comment_id }));
  });

module.exports = commentsRoutes;
