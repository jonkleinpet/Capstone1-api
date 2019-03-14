
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_KEY: process.env.API_KEY,
  DB_URL: 'postgres://jon@localhost:5432/laurie-blog'
};
