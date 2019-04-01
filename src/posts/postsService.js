const postsService = {

  getAllPosts(db) {
    return db
      .select('*')
      .from('posts');
  },

  createPost(db, newPost) {
    return db
      .select('*')
      .from('posts')
      .insert(newPost)
      .into('posts')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  
  deletePost(db, id) {
    return db('posts')
      .where({ id })
      .del();
  },

  editPost(db, post, id) {
    return db('posts')
      .where({ id })
      .update({
        title: post.title,
        content: post.content
      }, ['*']);
  }

};

module.exports = postsService;