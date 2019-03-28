process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = "excited-to-start-my-first-capstone";

require('dotenv').config();

process.env.TEST_DB_URL = 'postgresql://jon@localhost/test_laurie-blog';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
