require('dotenv').config({ path: './.env.test' });
jest.mock('jsonwebtoken');

const auth = require('../src/middleware/auth');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
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

    it('returns 400 if Authorization header is missing', () => {
        const req = { header: () => null };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 if Authorization header is malformed', () => {
        const req = { header: () => 'tokenWithoutBearer' };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 401 if token is invalid', () => {
        jwt.verify.mockImplementation(() => { throw { name: 'JsonWebTokenError' }; });
        const req = { header: () => 'Bearer fakeToken' };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 401 if token is expired', () => {
        jwt.verify.mockImplementation(() => { throw { name: 'TokenExpiredError' }; });
        const req = { header: () => 'Bearer expiredToken' };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('returns 500 if server error', () => {
        jwt.verify.mockImplementation(() => { throw {} });
        const req = { header: () => 'Bearer token' };
        auth(req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('calls next if token is valid', () => {
        jwt.verify.mockReturnValue({ email: 'test@example.com', password: 'test' });
        const req = { header: () => 'Bearer validToken' };
        auth(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user.email).toBe('test@example.com');
    });
});