require('dotenv').config({ path: './.env.test' });
const request = require('supertest');

const user_service = 'http://localhost:3000';
const product_service = 'http://localhost:3001';

const USER_PATH = '/api/v2/users';
const PRODUCT_PATH = '/api/v2/products';
const USER_REGISTER = `${USER_PATH}/register`;
const USER_LOGIN = `${USER_PATH}/login`;
const PRODUCT_CREATE = `${PRODUCT_PATH}`;
const PRODUCT_BY_OWNER = `${PRODUCT_PATH}/by-owner`;

const TEST_EMAIL = `test${Date.now()}@hle37.com`;
const TEST_PASSWORD = 'password123';

describe('Create Product Integration Flow', () => {

    it('should register a user', async () => {
        const res = await request(user_service)
            .post(USER_REGISTER)
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

        expect(res.statusCode).toBe(201);
    });

    it('should log in and retrieve token', async () => {
        const res = await request(user_service)
            .post(USER_LOGIN)
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

        expect(res.statusCode).toBe(201);

        token = res.body.token;
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.userId;

        expect(token).toBeDefined();
        expect(userId).toBeDefined();
    });

    it('should create a product', async () => {
        const productData = {
            name: 'Integration Test Product',
            description: 'This is a test product',
            price: 45.99
        };

        const res = await request(product_service)
            .post(PRODUCT_CREATE)
            .set('Authorization', `Bearer ${token}`)
            .send(productData);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe(productData.name);
        expect(res.body.ownerId).toBe(userId);
    });

    it('should verify the product is saved and belongs to the user', async () => {
        const res = await request(product_service)
            .get(`${PRODUCT_BY_OWNER}/${userId}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].ownerId).toBe(userId);
    });
});