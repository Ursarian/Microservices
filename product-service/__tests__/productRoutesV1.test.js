jest.mock('../src/models/product');
jest.mock('../src/utils/logger');

const request = require('supertest');
const express = require('express');
const router = require('../src/routes/v1/Products');
const Product = require('../src/models/product');
require('../src/utils/logger');

const app = express();
app.use(express.json());
app.use('/api/v1/products', router);

describe('API V1 Products - Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /all', () => {
        it('should return all products', async () => {
            Product.find.mockResolvedValue([{ name: 'P1' }, { name: 'P2' }]);

            const res = await request(app).get('/api/v1/products/all');

            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBe(2);
        });

        it('should return 500 on DB error', async () => {
            Product.find.mockRejectedValue(new Error('DB Error'));

            const res = await request(app).get('/api/v1/products/all');

            expect(res.statusCode).toBe(500);
        });
    });

    describe('GET /:id', () => {
        it('should return product by id', async () => {
            Product.findById.mockResolvedValue({ _id: '1', name: 'P1' });

            const res = await request(app).get('/api/v1/products/id/1');

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('P1');
        });

        it('should return 404 if product not found', async () => {
            Product.findById.mockResolvedValue(null);

            const res = await request(app).get('/api/v1/products/id/999');

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on invalid ID', async () => {
            Product.findById.mockRejectedValue({ name: 'CastError' });

            const res = await request(app).get('/api/v1/products/id/invalid');

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /', () => {
        it('should create product', async () => {
            const payload = { name: 'New P', description: '', price: 20, ownerId: 'abc' };
            Product.prototype.save = jest.fn().mockResolvedValue({ _id: '1', ...payload });

            const res = await request(app)
                .post('/api/v1/products')
                .send(payload);

            expect(res.statusCode).toBe(201);
            expect(res.body.name).toBe('New P');
        });

        it('should return 400 on validation error', async () => {
            Product.prototype.save = jest.fn().mockRejectedValue(new Error('Bad data'));

            const res = await request(app)
                .post('/api/v1/products')
                .send({}); // invalid payload

            expect(res.statusCode).toBe(400);
        });
    });

    describe('PUT /id/:id', () => {
        it('should update a product', async () => {
            Product.findByIdAndUpdate.mockResolvedValue({ _id: '1', name: 'Updated' });

            const res = await request(app)
                .put('/api/v1/products/id/1')
                .send({ name: 'Updated' });

            expect(res.statusCode).toBe(200);
            expect(res.body.name).toBe('Updated');
        });

        it('should return 404 if product not found', async () => {
            Product.findByIdAndUpdate.mockResolvedValue(null);

            const res = await request(app)
                .put('/api/v1/products/id/999')
                .send({ name: 'Nothing' });

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on DB error', async () => {
            Product.findByIdAndUpdate.mockRejectedValue(new Error('Fail'));

            const res = await request(app)
                .put('/api/v1/products/id/err')
                .send({});

            expect(res.statusCode).toBe(400);
        });
    });

    describe('DELETE /id/:id', () => {
        it('should delete a product', async () => {
            Product.findByIdAndDelete.mockResolvedValue({ _id: '1' });

            const res = await request(app).delete('/api/v1/products/id/1');

            expect(res.statusCode).toBe(200);
        });

        it('should return 404 if product not found', async () => {
            Product.findByIdAndDelete.mockResolvedValue(null);

            const res = await request(app).delete('/api/v1/products/id/999');

            expect(res.statusCode).toBe(404);
        });

        it('should return 400 on DB error', async () => {
            Product.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));

            const res = await request(app).delete('/api/v1/products/id/err');

            expect(res.statusCode).toBe(400);
        });
    });
});