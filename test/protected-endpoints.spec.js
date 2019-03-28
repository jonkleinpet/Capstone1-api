const knex = require('knex');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Protected endpoints', function () {
  let db;

  const {
    testUsers,
    testPosts,
    testComments
  } = helper.makePostsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.cleanTables(db));

  afterEach('cleanup', () => helper.cleanTables(db));

  beforeEach('insert articles', () =>
    helper.seedPosts(db, testUsers, testPosts, testComments)
  );

  it('responds with 401 Missing bearer token when no token', () => {
    return supertest(app)
      .post('/api/posts/blog')
      .expect(401, { error: 'Missing bearer token' });
  });

  it('responds 401 \'Unauthorized request\' when invalid JWT secret', () => {
    const validUser = testUsers[0];
    const invalidSecret = 'bad-secret';
    return supertest(app)
      .get('/api/posts/blog')
      .set('Authorization', helper.makeAuthHeader(validUser, invalidSecret))
      .expect(401, { error: 'Unauthorized request', message:'invalid signature' });
  });

  it('responds 401 \'Unauthorized request\' when invalid sub in payload', () => {
    const invalidUser = { user_name: 'user-not-existy', id: 1 };
    return supertest(app)
      .get('/api/posts/blog')
      .set('Authorization', helper.makeAuthHeader(invalidUser))
      .expect(401, { error: 'Unauthorized request' });
  });
});
