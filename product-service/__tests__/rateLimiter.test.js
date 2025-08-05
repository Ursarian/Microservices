require('dotenv').config({ path: './.env.test' });
const {
    productRateLimiter,
    rateLimiterFallback,
    startRateLimitCleanup,
} = require('../src/middleware/rateLimiter');

process.env.E429_TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS';
process.env.E429_CLIENT_TOO_MANY_REQUESTS = 'Too many requests';
process.env.SERVICE_NAME = 'test-service';
process.env.ENABLE_STRUCTURED_LOGS = 'false';

jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

const createMock = (type = 'product') => {
    const req = { user: { userId: 'test-user' }, ip: '1.2.3.4' };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();
    const limiter =
        type === 'fallback' ? rateLimiterFallback :
            productRateLimiter;
    return { req, res, next, limiter };
};

describe('rateLimiter middleware', () => {
    jest.useFakeTimers();

    beforeEach(() => {
        jest.clearAllTimers();
    });

    it('should allow requests under the limit', () => {
        const { req, res, next, limiter } = createMock();
        for (let i = 0; i < 2; i++) limiter(req, res, next);
        expect(next).toHaveBeenCalledTimes(2);
    });

    it('should block requests over the limit and burst', () => {
        const { req, res, next, limiter } = createMock();
        for (let i = 0; i < 30; i++) limiter(req, res, next);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E429_TOO_MANY_REQUESTS',
            message: 'Too many requests'
        });
    });

    it('should refill burst tokens over time', () => {
        const { req, res, next, limiter } = createMock();
        for (let i = 0; i < 30; i++) limiter(req, res, next);
        jest.advanceTimersByTime(30000);
        limiter(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should fallback limiter allow burst then throttle', () => {
        const { req, res, next, limiter } = createMock('fallback');
        for (let i = 0; i < 61; i++) limiter(req, res, next);
        expect(res.status).toHaveBeenCalledWith(429);
    });

    it('should clean up inactive request entries after timeout', () => {
        const req = { user: { userId: 'temp-user' }, ip: '127.0.0.1' };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        productRateLimiter(req, res, next);
        startRateLimitCleanup();
        jest.advanceTimersByTime(60000);
        productRateLimiter(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});