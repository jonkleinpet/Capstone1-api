const xss = require('xss');
const bcrypt = require('bcryptjs');

const userService = {

  validUserName(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db('users')
      .insert(newUser, '*')
      .into('users')
      .then(([user]) => user);
  },

  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      full_name: xss(user.full_name),
      date_created: user.date_created
    };
  },

  validPassword(pass) {
    const lowerCaseCheck = /(?=.*[a-z])/;
    const upperCaseCheck = /(?=.*[A-Z])/;
    const numberCheck = /(?=.*[0-9])/;
    const validation = {
      isValid: true,
      message: ''
    };
    
    if (pass.length < 6) {
      validation.isValid = false;
      validation.message = 'Password must be longer than 6 characters';
    } 

    else if (pass.length > 32) {
      validation.isValid = false;
      validation.message = 'Password must be less than 32 characters';
    } 
      
    else if (pass.startsWith(' ') || pass.endsWith(' ')) {
      validation.isValid = false;
      validation.message = 'Password must not start or end with empty spaces';
    } 
      
    else if (!lowerCaseCheck.test(pass)) {
      validation.isValid = false;
      validation.message = 'Password must contain at least one lower case letter';
    }
      
    else if (!upperCaseCheck.test(pass)) {
      validation.isValid = false;
      validation.message = 'Password must contain at least one upper case letter';
    }
      
    else if (!numberCheck.test(pass)) {
      validation.isValid = false;
      validation.message = 'Password must contain at least one number';
    }
    return validation;
  },

  hashPassword(pass) {
    return bcrypt.hash(pass, 10);
  }

};

module.exports = userService;
