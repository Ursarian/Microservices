const jwt = require('jsonwebtoken');
const serviceAuth = require('../src/middleware/serviceAuth');
const logger = require('../src/utils/logger');

jest.mock('jsonwebtoken');
jest.mock('../src/utils/logger');

describe('serviceAuth middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.SERVICE_JWT_SECRET = 'secret';
        process.env.E403_CLIENT_FORBIDDEN = 'Forbidden';
    });

    it('should return 403 if authorization header is missing', () => {
        serviceAuth(req, res, next);
        expect(logger.error).toHaveBeenCalledWith('Missing or malformed internal service token');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E403_FORBIDDEN',
            message: 'Forbidden'
        });
    });

    it('should return 403 if authorization header is malformed', () => {
        req.headers['authorization'] = 'Token abcdef';
        serviceAuth(req, res, next);
        expect(logger.error).toHaveBeenCalledWith('Missing or malformed internal service token');
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E403_FORBIDDEN',
            message: 'Forbidden'
        });
    });

    it('should return 403 if token is invalid or expired', () => {
        req.headers['authorization'] = 'Bearer invalidtoken';
        jwt.verify.mockImplementation(() => { throw new Error('jwt malformed'); });
        serviceAuth(req, res, next);
        expect(logger.error).toHaveBeenCalledWith('Failed to verify service token', { error: 'jwt malformed' });
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E403_FORBIDDEN',
            message: 'Invalid or expired service token'
        });
    });

    it('should set req.service and call next on valid token', () => {
        req.headers['authorization'] = 'Bearer validtoken';
        jwt.verify.mockReturnValue({ from: 'user-service' });
        serviceAuth(req, res, next);
        expect(req.service).toBe('user-service');
        expect(next).toHaveBeenCalled();
    });
});