function isError(data) {
  let error = false;
  for (const prop of ['content']) {
    if (!data[prop]) {
      error = true;
    }
  }
  return error;
}

module.exports = isError;
