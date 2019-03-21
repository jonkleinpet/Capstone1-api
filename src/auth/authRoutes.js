const express = require('express');
const authRoutes = express.Router();
const bodyParser = express.json();
const authService = require('./authService');

// POST authenticate user
authRoutes
  .post('/login', bodyParser, (req, res, next) => {
    const { name, password } = req.body;
    const loginUser = { name, password };
    const knex = req.app.get('db');

    for (const [key, value] of Object.entries(loginUser)) {
      if (value == null) {
        return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
    }
      
    // Check if user exists
    authService.getUser(knex, loginUser.name)
      .then(user => {
        if (!user) {
          return res.status(400).json({ error: 'Incorrect user name or password' });
        }

        // Compare password input with password in db
        return authService.comparePasswords(
          loginUser.password,
          user.password
        )
          .then(didMatch => {   
            if (!didMatch) {
              return res.status(400).json({ error: 'Incorrect user name or password' });
            }

            const sub = loginUser.name;
            const payload = {
              id: user.id,
              admin: user.admin
            };
        
            res.send({ authToken: authService.createjwt(sub, payload) });
          });     
      })
      .catch(next);
  });

module.exports = authRoutes;