jest.mock('../src/models/product');
jest.mock('axios');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { userId: 'user123' };
    next();
}));
jest.mock('../src/middleware/authorizeOwnershipOrRole', () =>
    () => (req, res, next) => next()
);

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v2/Products');
const Product = require('../src/models/product');
const axios = require('axios');
require('../src/middleware/auth');

const app = express();
app.use(express.json());
app.use('/api/v2/products', router);

describe('API V2 Products - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /all', () => {
        it('should return all products', async () => {
            Product.find.mockResolvedValue([{ name: 'A' }, { name: 'B' }]);

            const res = await request(app).get('/api/v2/products/all');
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it('should return 500 on DB error', async () => {
            Product.find.mockRejectedValue(new Error('fail'));
            const res = await request(app).get('/api/v2/products/all');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /id/:id', () => {
        it('should return a product by ID', async () => {
            Product.findById.mockResolvedValue({ _id: '1', name: 'Item' });
            const res = await request(app).get('/api/v2/products/id/1');
            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if product not found', async () => {
            Product.findById.mockResolvedValue(null);
            const res = await request(app).get('/api/v2/products/id/999');
            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on invalid ID', async () => {
            Product.findById.mockRejectedValue({ name: 'CastError' });
            const res = await request(app).get('/api/v2/products/id/bad-id');
            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /by-owner/:userId', () => {
        it('should return products by user', async () => {
            Product.find.mockResolvedValue([{ ownerId: 'user123' }]);
            const res = await request(app).get('/api/v2/products/by-owner/user123');
            expect(res.statusCode).toBe(200);
        });

        it('should return 500 on DB error', async () => {
            Product.find.mockRejectedValue(new Error('fail'));
            const res = await request(app).get('/api/v2/products/by-owner/user123');
            expect(res.statusCode).toBe(500);
        });
    });

    describe('POST /', () => {
        it('should create a product if user exists', async () => {
            axios.get.mockResolvedValue({ data: { _id: 'user123', email: 'test@a.com' } });
            Product.prototype.save = jest.fn().mockResolvedValue({ _id: '1', name: 'New' });

            const res = await request(app)
                .post('/api/v2/products')
                .send({ name: 'New', price: 50 });

            expect(res.statusCode).toBe(201);
        });

        it('should return 404 if user not found', async () => {
            axios.get.mockResolvedValue({ data: null });

            const res = await request(app)
                .post('/api/v2/products')
                .send({ name: 'New' });

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on failure to create', async () => {
            axios.get.mockResolvedValue({ data: { _id: 'user123' } });
            Product.prototype.save = jest.fn().mockRejectedValue(new Error('bad save'));

            const res = await request(app)
                .post('/api/v2/products')
                .send({ name: 'Fail' });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('PUT /id/:id', () => {
        it('should update product by id', async () => {
            Product.findByIdAndUpdate.mockResolvedValue({ _id: '1', name: 'Updated' });

            const res = await request(app)
                .put('/api/v2/products/id/1')
                .send({ name: 'Updated' });

            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if product not found', async () => {
            Product.findByIdAndUpdate.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/v2/products/id/999')
                .send({ name: 'Not found' });

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on update failure', async () => {
            Product.findByIdAndUpdate.mockRejectedValue(new Error('fail'));

            const res = await request(app)
                .put('/api/v2/products/id/err')
                .send({});

            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /id/:id', () => {
        it('should delete a product', async () => {
            Product.findByIdAndDelete.mockResolvedValue({ _id: '1' });
            const res = await request(app).delete('/api/v2/products/id/1');
            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if not found', async () => {
            Product.findByIdAndDelete.mockResolvedValue(null);
            const res = await request(app).delete('/api/v2/products/id/999');
            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on failure', async () => {
            Product.findById.mockResolvedValue({ _id: 'fail', ownerId: '123' });
            Product.findByIdAndDelete.mockRejectedValue(new Error('fail'));

            const res = await request(app).delete('/api/v2/products/id/fail');
            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /by-owner/:userId', () => {
        it('should delete all products by userId', async () => {
            Product.deleteMany.mockResolvedValue({ deletedCount: 2 });

            const res = await request(app).delete('/api/v2/products/by-owner/user123');
            expect(res.statusCode).toBe(200);
            expect(res.body.count).toBe(2);
        });

        it('should return 400 on failure', async () => {
            Product.deleteMany.mockRejectedValue(new Error('fail'));

            const res = await request(app).delete('/api/v2/products/by-owner/user123');
            expect(res.statusCode).toBe(400);
        });
    });
});