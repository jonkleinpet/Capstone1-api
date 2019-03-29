const express = require('express');
const userRoutes = express.Router();
const userService = require('./userService');
const bodyParser = express.json();

userRoutes
  .route('/')
  .post(bodyParser, (req, res, next) => {
    const knex = req.app.get('db');
    const { user_name, full_name, password } = req.body;
    const isPasswordValid = userService.validPassword(password);

    !isPasswordValid.isValid
      ? res.status(400).json({ error: isPasswordValid.message })
      : userService.validUserName(knex, user_name)
        
        .then(userNameTaken => {
          if (userNameTaken) {
            return res.status(400).json({ error: 'Username already taken' });
          }

          return userService.hashPassword(password)
            .then(hashPass => {
              const newUser = {
                user_name,
                full_name,
                password: hashPass,
                date_created: 'now()'
              };

              return userService.insertUser(knex, newUser)
                .then(user => {              
                  res
                    .status(201)
                    .json(userService.serializeUser(user));
                });
            });
        })
        .catch(next);
  });

module.exports = userRoutes;