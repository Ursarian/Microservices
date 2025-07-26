const request = require('supertest');
const app = require('../src/app');

describe('User API', () => {
    it('GET /api/v2/users/profile - without token should fail', async () => {
        console.log(app._router.stack
            .filter(r => r.route)
            .map(r => r.route.path));

        const res = await request(app).get('/api/v2/users/profile');
        expect(res.statusCode).toBe(400);
    });
});