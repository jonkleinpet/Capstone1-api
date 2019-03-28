
function foundPosts(data) {
  let postFound = true;

  if (!data.length) {
    postFound = false;
  }
  return postFound;
}

module.exports = foundPosts;