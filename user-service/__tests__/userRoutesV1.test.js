require('dotenv').config({ path: './.env.test' });
jest.mock('../src/models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { email: 'test@hle37.com' };
    next();
}));

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v1/Users');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v1/users', router);

describe('User V1 Routes Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com' });

            const res = await request(app)
                .post('/api/v1/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful registration', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            User.prototype.save = jest.fn().mockResolvedValue({});

            const res = await request(app)
                .post('/api/v1/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(201);
        });

        it('should return 500 if registration throws error', async () => {
            User.findOne.mockImplementation(() => {
                throw new Error('Simulated registration failure');
            });

            const res = await request(app)
                .post('/api/v1/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /login', () => {
        it('should return 400 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if password mismatch', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com', password: 'hashed_password' });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful login', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com', password: 'hashed_password' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked.jwt.token');

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(201);
            expect(res.body.token).toBe('mocked.jwt.token');
        });


        it('should return 500 if login throws error', async () => {
            User.findOne.mockImplementation(() => {
                throw new Error('Simulated login failure');
            });

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /profile', () => {
        it('should return 200 and user email from token', async () => {
            const res = await request(app).get('/api/v1/users/profile');

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('test@hle37.com');
        });
    });
});