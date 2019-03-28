/* eslint-disable no-undef */
const knex = require('knex');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Posts Endpoints', function () {
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

  describe('GET /api/posts', () => {
    context('Given no posts exist in database', () => {
      it('responds with 404 and an error message', () => {
        return supertest(app)
          .get('/api/posts')
          .expect(404, { message: 'Cannot find posts' });
      });
    });

    context('Given there are posts in the database', () => {
      beforeEach('insert posts', () => {
        helper.seedPosts(
          db,
          testUsers,
          testPosts,
          testComments
        );
        
      });

      it('responds with 200 and all posts', () => {
        const expectedPosts = testPosts.map(p =>
          helper.expectedPosts(
            p,
            testComments
          )
        );

        return supertest(app)
          .get('/api/posts')
          .expect(200, expectedPosts);
      });

    });
  });
});
    
