function findPost(dbData) {
  let didFind = true;
  
  if (!dbData.length) {
    didFind = false;
  }

  return didFind;
}

module.exports = findPost;