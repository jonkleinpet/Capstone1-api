
const cloudinaryService = {

  postImageUrl(db, img) {
    return db
      .select('*')
      .from('images')
      .insert(img)
      .into('images')
      .returning('*')
      .then(rows => rows[0]);
  },

  getImages(db) {
    return db
      .select('*')
      .from('images');
  }
};

module.exports = cloudinaryService;