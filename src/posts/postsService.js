const xss = require('xss');

const sanitize = function (post) {

  return {
    id: post.id,
    content: xss(post.content),
    date_added: post.date_added
  };

};

const postsService = {

  getAllPosts(db) {
    return db
      .select('*')
      .from('posts');
  },

  createPost(db, newPost) {
    //newPost = sanitize(newPost);
    return db
      .select('*')
      .from('posts')
      .insert(newPost)
      .into('posts')
      .then(() => {
        return db.select('*').from('posts');
      });
  },
  
  getPost(db, id) {
    return db
      .select('*')
      .from('posts')
      .where('id', id);
  }
};

module.exports = postsService;