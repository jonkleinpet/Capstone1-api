/* eslint-disable quotes */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const testHelpers = {
  makeUsersArray() {
    return [
      {
        id: 1,
        admin: true,
        user_name: "test",
        full_name: "test foo",
        date_created: new Date("2019-01-22T16:28:32.615Z"),
        password: "testing"
      },
      {
        id: 2,
        admin: false,
        user_name: "test2",
        full_name: "test foo2",
        date_created: new Date("2019-01-22T16:28:32.615Z"),
        password: "testpassword"
      },
      {
        id: 3,
        admin: false,
        user_name: "test3",
        full_name: "test foo3",
        date_created: new Date("2019-01-22T16:28:32.615Z"),
        password: "testpassword"
      }
    ];
  },

  makePostsArray() {
    return [
      {
        id: 1,
        content: "test content 1",
        date_added: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        id: 2,
        content: "test content 2",
        date_added: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        id: 3,
        content: "test content 3",
        date_added: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        id: 4,
        content: "test content 4",
        date_added: new Date("2019-01-22T16:28:32.615Z")
      }
    ];
  },

  makeCommentsArray() {
    return [
      {
        comment_id: 1,
        post_id: 1,
        user_id: 1,
        content: "test content 1",
        date_created: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        comment_id: 2,
        post_id: 1,
        user_id: 3,
        content: "test content 2",
        date_created: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        comment_id: 3,
        post_id: 2,
        user_id: 2,
        content: "test content 3",
        date_created: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        comment_id: 4,
        post_id: 3,
        user_id: 1,
        content: "test content 4",
        date_created: new Date("2019-01-22T16:28:32.615Z")
      },
      {
        comment_id: 5,
        post_id: 1,
        user_id: 2,
        content: "test content 5",
        date_created: new Date("2019-01-22T16:28:32.615Z")
      }
    ];
  },

  expectedPosts(post, comments) {
    return {
      id: post.id,
      content: post.content,
      date_added: new Date(post.date_added).toISOString()
    };
  },

  expectedComments(users, post_id, comments) {
    const commentArray = comments.filter(c => c.post_id === post_id);

    return commentArray.map(c => {
      const commentUser = users.find(u => u.id === c.user_id);

      return {
        id: c.id,
        content: c.content,
        date_created: new Date(c.date_created).toISOString(),
        user: {
          id: commentUser.id,
          admin: commentUser.admin,
          user_name: commentUser.user_name,
          full_name: commentUser.full_name,
          date_created: new Date(commentUser.date_created).toISOString(),
          password: commentUser.password
        }
      };
    });
  },

  makePostsFixtures() {
    const testUsers = this.makeUsersArray();
    const testPosts = this.makePostsArray();
    const testComments = this.makeCommentsArray();
    return { testUsers, testPosts, testComments };
  },

  cleanTables(db) {
    return db.transaction(trx =>
      trx
        .raw(
          `TRUNCATE
          comments,
          images,
          posts,
          users
        `
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE posts_id_seq minvalue 0 START WITH 1`),
            trx.raw(
              `ALTER SEQUENCE comments_comment_id_seq minvalue 0 START WITH 1`
            ),
            trx.raw(`SELECT setval('users_id_seq', 0)`),
            trx.raw(`SELECT setval('posts_id_seq', 0)`),
            trx.raw(`SELECT setval('comments_comment_id_seq', 0)`)
          ])
        )
    );
  },

  seedUsers(db, users) {
    const usersArray = users.map(u => ({
      ...u,
      password: bcrypt.hashSync(u.password, 1)
    }));
    return db
      .into("users")
      .insert(usersArray)
      .then(() =>
        db.raw(`SELECT setval('users_id_seq', ?)`, [users[users.length - 1].id])
      );
  },

  seedPosts(db, users, posts, comments = []) {
    return db.transaction(async trx => {
      await this.seedUsers(trx, users);
      await trx.into("posts").insert(posts);

      await trx.raw(`SELECT setval('posts_id_seq', ?)`, [
        posts[posts.length - 1].id
      ]);

      if (comments.length) {
        await trx.into("comments").insert(comments);
        await trx.raw(`SELECT setval('comments_comment_id_seq', ?)`, [
          comments[comments.length - 1].comment_id
        ]);
      }
    });
  },

  makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const authToken = jwt.sign({ id: user.id, admin: true }, secret, {
      subject: user.user_name,
      algorithm: 'HS256'
    });
    return `Bearer ${authToken}`;
  }
};

module.exports = testHelpers;
