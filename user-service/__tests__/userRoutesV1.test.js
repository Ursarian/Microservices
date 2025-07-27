const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v1/Users');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../src/middleware/auth');

jest.mock('../src/models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { email: 'mocked@example.com' };
    next();
}));

const app = express();
app.use(express.json());
app.use('/api/v1/users', router);

describe('User Routes (unit-style with mocks)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'exists@example.com' });

            const res = await request(app)
                .post('/api/v1/users/register')
                .send({ email: 'exists@example.com', password: '123456' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful registration', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpass');
            User.prototype.save = jest.fn().mockResolvedValue({});

            const res = await request(app)
                .post('/api/v1/users/register')
                .send({ email: 'new@example.com', password: '123456' });

            expect(res.statusCode).toBe(201);
        });
    });

    describe('POST /login', () => {
        it('should return 400 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'missing@example.com', password: '123456' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if password mismatch', async () => {
            User.findOne.mockResolvedValue({ email: 'user@example.com', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'user@example.com', password: 'wrongpass' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful login', async () => {
            User.findOne.mockResolvedValue({ _id: '1', email: 'user@example.com', password: 'hashed' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked.jwt.token');

            const res = await request(app)
                .post('/api/v1/users/login')
                .send({ email: 'user@example.com', password: 'correctpass' });

            expect(res.statusCode).toBe(201);
            expect(res.body.token).toBe('mocked.jwt.token');
        });
    });

    describe('GET /profile (with mocked auth)', () => {
        it('should return 200 and user email from token', async () => {
            auth.mockImplementation((req, res, next) => {
                req.user = { email: 'mocked@example.com' };
                next();
            });

            const res = await request(app).get('/api/v1/users/profile');

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('mocked@example.com');
        });
    });
});