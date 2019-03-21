const commentService = {

  getPostComments(db) {
    return db
      .select('*')
      .from('posts')
      .join('comments', function () {
        this
          .on('posts.id', '=', 'comments.post_id');
      });
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
      .then(() => {
        return db.select('*').from('comments');
      });
  }

};

module.exports = commentService;