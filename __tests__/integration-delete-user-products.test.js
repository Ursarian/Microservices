require('dotenv').config({ path: './.env.test' });
const request = require('supertest');
const connectToDatabase = require('../user-service/src/db');
const mongoose = require('mongoose');
const userApp = require('../user-service/src/app');
const productApp = require('../product-service/src/app');
const User = require('../user-service/src/models/user');
const Product = require('../product-service/src/models/product');

const TEST_EMAIL = 'test@hle37.com';
const TEST_PASSWORD = 'password123';

// jest.setTimeout(1000);

beforeAll(async () => {
    db = await connectToDatabase();
    console.log(db.connection.host);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await db.connection.close();

});

describe('User deletion triggers product deletion', () => {

    it('should register a user', async () => {
        console.log('▶️  Sending registration request...');

        const res = await request(userApp)
            .post('/api/v2/users/register')
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

        console.log('Register response:', res.statusCode, res.body);

        expect(res.statusCode).toBe(201);
    });

    // it('should log in and get a token', async () => {
    //     const res = await request(userApp)
    //         .post('/api/v2/users/login')
    //         .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

    //     console.log('Login response:', res.statusCode, res.body);

    //     expect(res.statusCode).toBe(201);
    //     token = res.body.token;
    //     const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    //     userId = payload.userId;
    //     expect(token).toBeDefined();
    // });

    // it('should create a product owned by the user', async () => {
    //     const res = await request(productApp)
    //         .post('/api/v2/products')
    //         .set('Authorization', `Bearer ${token}`)
    //         .send({
    //             name: 'Test Product',
    //             description: 'Just a test',
    //             price: 99.99
    //         });

    //     expect(res.statusCode).toBe(201);
    //     expect(res.body.ownerId).toBe(userId);
    // });

    // it('should delete the user and cascade delete their products', async () => {
    //     const deleteRes = await request(userApp)
    //         .delete('/api/v2/users/me')
    //         .set('Authorization', `Bearer ${token}`);

    //     expect(deleteRes.statusCode).toBe(200);

    //     const checkRes = await request(productApp)
    //         .get(`/api/v2/products/by-owner/${userId}`);

    //     expect(checkRes.statusCode).toBe(200);
    //     expect(checkRes.body).toEqual([]);
    // });
});