const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helper = require('./test-helpers');

describe('Auth Endpoints', function () {
  let db;

  const { testUsers } = helper.makePostsFixtures();
  const testUser = testUsers[0];

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

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () =>
      helper.seedUsers(
        db,
        testUsers
      )
    );

    const requiredFields = ['password', 'name'];

    requiredFields.forEach(f => {
      const loginAttempt = {
        name: testUser.user_name,
        password: testUser.password
      };

      it(`responds with 400 required error when ${f} is missing`, () => {
        delete loginAttempt[f];
        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttempt)
          .expect(400, { error: `Missing '${f}' in request body` });
      });

      it('responds 400 \'invalid user_name or password\' when bad user_name', () => {
        const userInvalidUser = { name: 'user-not', password: 'existy' };
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidUser)
          .expect(400, { error: 'Incorrect user name or password' });
      });

      it('responds 400 \'invalid user_name or password\' when bad password', () => {
        const userInvalidPass = { name: testUser.user_name, password: 'incorrect' };
        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidPass)
          .expect(400, { error: 'Incorrect user name or password' });
      });

      it('responds 200 and JWT auth token using secret when valid credentials', () => {
        const userValidCreds = {
          name: testUser.user_name,
          password: testUser.password,
        };
        const expectedToken = jwt.sign(
          { id: testUser.id, admin: testUser.admin },
          process.env.JWT_SECRET,
          {
            subject: testUser.user_name,
            algorithm: 'HS256',
          }
        );
        return supertest(app)
          .post('/api/auth/login')
          .send(userValidCreds)
          .expect(200, {
            authToken: expectedToken,
          });
      });
    });

  });

});