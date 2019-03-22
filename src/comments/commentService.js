const xss = require('xss');

const sanitize = function (comment) {
  
  return {
    post_id: comment.post_id,
    user_id: comment.user_id,
    content: xss(comment.content)
  };
  
};

const commentService = {

  getPostComments(db) {
    return db
      .select('*')
      .from('comments');
  },

  getUserName(db) {
    return db
      .select(
        'user_name',
        'users.id'
      )
      .from('users');
  },

  postComment(db, comment) {
    
    return db
      .select('*')
      .from('comments')
      .insert(comment)
      .into('comments')
      .returning('*')
      .then(rows => {
        return rows[0]
      });
      /* .then(() => {
        return db.select('*').from('comments');
      }); */
  }

};

module.exports = commentService;