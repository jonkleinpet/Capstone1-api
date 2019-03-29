Laurie-Blog-API
===============

Making Requests
===============
## Posts
GET: `/api/posts`

POST: `/api/posts/blog`

DELETE: `/api/posts/blog/:id`

## Comments
GET: `/api/comments`

POST: `/api/comments`

DELETE: `/api/comments/:comment_id`

## User Register
POST: `/api/users`

## User Login
POST: `/api/auth/login`

About
=====
This api uses Express "https://expressjs.com"

framework and pg database "https://www.postgresql.org"

image hosting from "https://cloudinary.com".

deployed on "https://heroku.com"

## Test Suite
Mocha: "https://mochajs.org/"

Chai: "https://www.chaijs.com"

Supertest: "https://www.npmjs.com/package/supertest"

nodemon: "https://www.npmjs.com/package/nodemon"

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`