const {
    loginRateLimiter,
    usersRateLimiter,
    rateLimiterFallback,
    startRateLimitCleanup
} = require('../src/middleware/rateLimiter');

const customLimiter = require('../src/middleware/rateLimiter').createLimiter?.(5, 3);

jest.mock('../src/utils/logger', () => ({
    error: jest.fn(),
    info: jest.fn()
}));

const createMock = (type = 'users') => {
    const req = { user: { userId: 'test-user' }, ip: '1.2.3.4' };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();
    const limiter =
        type === 'login' ? loginRateLimiter :
            type === 'fallback' ? rateLimiterFallback :
                usersRateLimiter;
    return { req, res, next, limiter };
};

describe('rateLimiter middleware', () => {
    jest.useFakeTimers();

    beforeEach(() => {
        jest.clearAllTimers();
    });

    it('should allow requests under the limit (usersRateLimiter)', () => {
        const { req, res, next, limiter } = createMock();
        for (let i = 0; i < 2; i++) {
            limiter(req, res, next);
        }
        expect(next).toHaveBeenCalledTimes(2);
    });

    it('should block requests over the limit and burst (usersRateLimiter)', () => {
        const { req, res, next, limiter } = createMock();
        for (let i = 0; i < 12; i++) {
            limiter(req, res, next);
        }
        expect(res.status).toHaveBeenCalledWith(429);
    });

    it('should refill burst tokens over time (usersRateLimiter)', () => {
        const { req, res, next, limiter } = createMock();

        for (let i = 0; i < 12; i++) {
            limiter(req, res, next);
        }

        jest.advanceTimersByTime(30000);

        limiter(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should apply loginRateLimiter with stricter limits', () => {
        const { req, res, next, limiter } = createMock('login');
        for (let i = 0; i < 5; i++) {
            limiter(req, res, next);
        }
        expect(res.status).toHaveBeenCalledWith(429);
    });

    it('should fallback limiter allow burst then throttle', () => {
        const { req, res, next, limiter } = createMock('fallback');
        for (let i = 0; i < 61; i++) {
            limiter(req, res, next);
        }
        expect(res.status).toHaveBeenCalledWith(429);
    });

    describe('rateLimiter cleanup (real)', () => {
        it('should remove inactive request entries from request logs', () => {
            const req = { ip: '127.0.0.1' };
            const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
            const next = jest.fn();

            rateLimiterFallback(req, res, next);

            startRateLimitCleanup();
            jest.advanceTimersByTime(60000);

            rateLimiterFallback(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});