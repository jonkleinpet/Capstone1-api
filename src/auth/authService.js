const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const authService = {

  getUser(db, user_name) {
    return db('users')
      .where({ user_name })
      .first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  createjwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },

  getUserId(token) {
    const user = jwt.decode(token.slice(7, token.length));
    const user_id = user.id;
    return user_id;
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithm: ['HS256']
    });
  },

};

module.exports = authService;