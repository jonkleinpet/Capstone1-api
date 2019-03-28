const knex = require('knex');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Comments Endpoints', function () {
  let db;

  const {
    testUsers,
    testPosts,
    testComments
  } = helper.makePostsFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helper.cleanTables(db));

  afterEach('cleanup', () => helper.cleanTables(db));

  describe('POST /api/comments', () => {
    beforeEach('insert posts', () =>
      helper.seedPosts(
        db,
        testUsers,
        testPosts
      )
    );

    it('creates a comment, responding with 201 and the new comment', function () {
      this.retries(2);
      const testPost = testPosts[0];
      const testUser = testUsers[0];
      const newComment = {
        post_id: testPost.id,
        content: 'Test new comment'
      };
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helper.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('comment_id');
          expect(res.body.content).to.eql(newComment.content);
          expect(res.body.post_id).to.eql(newComment.post_id);
          expect(res.body.user_id).to.eql(testUser.id);
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect(res =>
          db
            .from('comments')
            .select('*')
            .where({ comment_id: res.body.comment_id })
            .first()
            .then(row => {
              expect(row.content).to.eql(newComment.content);
              expect(row.post_id).to.eql(newComment.post_id);
              expect(row.user_id).to.eql(testUser.id);
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
              const actualDate = new Date(row.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

  });
  
});