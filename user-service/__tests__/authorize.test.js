require('dotenv').config({ path: './.env.test' });
const authorize = require('../src/middleware/authorize');

describe('authorize middleware', () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    beforeEach(() => {
        res.status.mockClear();
        res.json.mockClear();
        next.mockClear();
    });

    it('should return 403 if role is missing on user object', () => {
        const req = { user: {} };
        authorize('user')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if user role is below required role', () => {
        const req = { user: { role: 'user' } };
        authorize('manager')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should call next if user role meets or exceeds required role', () => {
        const req = { user: { role: 'admin' } };
        authorize('manager')(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});