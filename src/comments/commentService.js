const xss = require('xss');

const commentService = {
  getPostComments(db) {
    return db.select('*').from('comments');
  },

  getUserName(db) {
    return db.select('user_name', 'users.id').from('users');
  },

  serializeComments(comment) {
    return {
      comment_id: comment.comment_id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: xss(comment.content),
      date_created: comment.date_created
    };
  },

  postComment(db, comment) {
    return db
      .select('*')
      .from('comments')
      .insert(comment)
      .into('comments')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  deleteComment(db, comment_id) {
    return db('comments')
      .where({comment_id})
      .del();
    
  }

};

module.exports = commentService;