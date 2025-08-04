const request = require('supertest');

const USER_SERVICE_URL = 'http://localhost:3000/api/v2/users';
const PRODUCT_SERVICE_URL = 'http://localhost:3001/api/v2/products';

jest.setTimeout(30000);

describe('E2E - User and Product flow', () => {
    let token;
    let userId;
    let productId;

    const testEmail = `test${Date.now()}@example.com`;
    const password = 'password123';

    it('should register a new user', async () => {
        const res = await request(USER_SERVICE_URL)
            .post('/register')
            .send({ email: testEmail, password });

        expect(res.statusCode).toBe(201);
    });

    it('should login and get a token', async () => {
        const res = await request(USER_SERVICE_URL)
            .post('/login')
            .send({ email: testEmail, password });

        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
        token = res.body.token;

        const decoded = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString()
        );
        userId = decoded.userId;
    });

    it('should create a product for that user', async () => {
        const res = await request(PRODUCT_SERVICE_URL)
            .post('/')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'E2E Test Product',
                description: 'Made in test',
                price: 9.99
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.ownerId).toBe(userId);
        productId = res.body._id;
    });

    it('should update the product name and price', async () => {
        const res = await request(PRODUCT_SERVICE_URL)
            .put(`/id/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated Product Name',
                price: 19.99
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated Product Name');
        expect(res.body.price).toBe(19.99);
    });

    it('should delete the user and cascade delete products', async () => {
        const res = await request(USER_SERVICE_URL)
            .delete('/me')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);

        // Wait for event to propagate
        await new Promise(res => setTimeout(res, 3000));

        const check = await request(PRODUCT_SERVICE_URL)
            .get(`/by-owner/${userId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(check.statusCode).toBe(200);
        expect(check.body).toEqual([]);
    });
});