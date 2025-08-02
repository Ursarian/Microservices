require('dotenv').config({ path: './.env.test' });
const request = require('supertest');

const user_service = 'http://localhost:3000';
const product_service = 'http://localhost:3001';

const USER_PATH = '/api/v2/users';
const USER_REGISTRATION_PATH = `${USER_PATH}/register`;
const USER_LOGIN_PATH = `${USER_PATH}/login`;
const USER_DELETE_ME_PATH = `${USER_PATH}/me`;
const PRODUCT_PATH = '/api/v2/products';
const PRODUCT_BY_OWNER_PATH = `${PRODUCT_PATH}/by-owner`;

const TEST_EMAIL = `test${Date.now()}@hle37.com`;
const TEST_PASSWORD = 'password123';

describe('User deletion triggers product deletion', () => {

    it('should register a user', async () => {
        const res = await request(user_service)
            .post(USER_REGISTRATION_PATH)
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

        expect(res.statusCode).toBe(201);
    });

    it('should log in and get a token', async () => {
        const res = await request(user_service)
            .post(USER_LOGIN_PATH)
            .send({ email: TEST_EMAIL, password: TEST_PASSWORD });

        expect(res.statusCode).toBe(201);

        token = res.body.token;
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.userId;

        expect(token).toBeDefined();
        expect(userId).toBeDefined();
    });

    it('should create a product owned by the user', async () => {
        const res = await request(product_service)
            .post(PRODUCT_PATH)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Product',
                description: 'Just a test',
                price: 99.99
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.ownerId).toBe(userId);
    });

    it('should delete the user and cascade delete their products', async () => {
        const deleteRes = await request(user_service)
            .delete(USER_DELETE_ME_PATH)
            .set('Authorization', `Bearer ${token}`);
        expect(deleteRes.statusCode).toBe(200);

        // Wait for event to propagate
        await new Promise(res => setTimeout(res, 3000));

        const checkRes = await request(product_service)
            .get(`${PRODUCT_BY_OWNER_PATH}/${userId}`);

        expect(checkRes.statusCode).toBe(200);
        expect(checkRes.body).toEqual([]);
    });
});