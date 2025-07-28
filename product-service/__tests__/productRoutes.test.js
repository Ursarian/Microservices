require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Product = require('../src/models/product');
const connectToDatabase = require('../src/db');

beforeAll(async () => {
    await connectToDatabase();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Product API', () => {
    beforeEach(async () => {
        await Product.deleteMany({});
        await Product.create({ name: 'Test Product', price: 9.99 });
    });

    it('GET /api/v2/products/all should return products', async () => {
        const res = await request(app).get('/api/v2/products/all');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].name).toBe('Test Product');
    });
});
