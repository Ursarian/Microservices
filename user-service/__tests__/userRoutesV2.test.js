jest.mock('../src/models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('axios');
jest.mock('../src/utils/eventPublisher', () => ({
    publishUserDeleted: jest.fn()
}));
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { email: 'test@hle37.com', userId: '123', role: 'admin' };
    next();
}));
jest.mock('../src/middleware/rateLimiter', () => ({
    loginRateLimiter: (req, res, next) => next(),
    usersRateLimiter: (req, res, next) => next(),
    rateLimiterFallback: (req, res, next) => next(),
    startRateLimitCleanup: () => { }
}));

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v2/Users');
const User = require('../src/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { publishUserDeleted } = require('../src/utils/eventPublisher');
require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v2/users', router);

describe('User V2 Routes Unit Test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should return 400 if user already exists', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com' });

            const res = await request(app)
                .post('/api/v2/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful registration', async () => {
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashed_password');
            User.prototype.save = jest.fn().mockResolvedValue({});

            const res = await request(app)
                .post('/api/v2/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(201);
        });

        it('should return 500 if registration throws error', async () => {
            User.findOne.mockImplementation(() => {
                throw new Error('Simulated registration failure');
            });

            const res = await request(app)
                .post('/api/v2/users/register')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /login', () => {
        it('should return 400 if user not found', async () => {
            User.findOne.mockResolvedValue(null);

            const res = await request(app)
                .post('/api/v2/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 400 if password mismatch', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com', password: 'hashed_password' });
            bcrypt.compare.mockResolvedValue(false);

            const res = await request(app)
                .post('/api/v2/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(400);
        });

        it('should return 201 on successful login', async () => {
            User.findOne.mockResolvedValue({ email: 'test@hle37.com', password: 'hashed_password' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mocked.jwt.token');

            const res = await request(app)
                .post('/api/v2/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(201);
            expect(res.body.token).toBe('mocked.jwt.token');
        });

        it('should return 500 if login throws error', async () => {
            User.findOne.mockImplementation(() => {
                throw new Error('Simulated login failure');
            });

            const res = await request(app)
                .post('/api/v2/users/login')
                .send({ email: 'test@hle37.com', password: 'password' });

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /profile', () => {
        it('should return 200 and user email from token', async () => {
            const res = await request(app).get('/api/v2/users/profile');

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('test@hle37.com');
        });
    });

    describe('GET /all', () => {
        it('should return all users', async () => {
            User.find.mockResolvedValue([
                { _id: '1', email: 'test1@hle37.com' },
                { _id: '2', email: 'test2@hle37.com' }
            ]);

            const res = await request(app).get('/api/v2/users/all');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it('should return 500 if DB throws error', async () => {
            User.find.mockImplementation(() => { throw new Error('DB failure'); });

            const res = await request(app).get('/api/v2/users/all');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /:id', () => {
        it('should return user if found', async () => {
            User.findById.mockResolvedValue({ _id: '123', email: 'test@hle37.com' });

            const res = await request(app).get('/api/v2/users/id/123');
            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe('test@hle37.com');
        });

        it('should return 404 if user not found', async () => {
            User.findById.mockResolvedValue(null);

            const res = await request(app).get('/api/v2/users/id/123');
            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on invalid ID', async () => {
            User.findById.mockImplementation(() => { throw { name: 'CastError' }; });

            const res = await request(app).get('/api/v2/users/id/bad-id');
            expect(res.statusCode).toBe(400);
        });

        it('should return 500 for generic error', async () => {
            User.findById.mockImplementation(() => { throw new Error('Unexpected'); });

            const res = await request(app).get('/api/v2/users/id/any');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('DELETE /me', () => {
        it('should delete user and products', async () => {
            User.findByIdAndDelete.mockResolvedValue({ _id: '123' });
            axios.delete.mockResolvedValue({});

            const res = await request(app).delete('/api/v2/users/me');
            expect(publishUserDeleted).toHaveBeenCalledWith({ id: '123' });
            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if user not found', async () => {
            User.findByIdAndDelete.mockResolvedValue(null);

            const res = await request(app).delete('/api/v2/users/me');
            expect(res.statusCode).toBe(404);
        });

        it('should still return 200 even if product-service fails', async () => {
            User.findByIdAndDelete.mockResolvedValue({ _id: '123' });
            axios.delete.mockImplementation(() => { throw new Error('Crash'); });

            const res = await request(app).delete('/api/v2/users/me');
            expect(res.statusCode).toBe(200);
        });

        it('should return 500 if something else fails', async () => {
            User.findByIdAndDelete.mockImplementation(() => { throw new Error('Crash'); });

            const res = await request(app).delete('/api/v2/users/me');
            expect(res.statusCode).toBe(500);
        });
    });
});