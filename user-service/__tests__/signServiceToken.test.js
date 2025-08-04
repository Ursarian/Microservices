const jwt = require('jsonwebtoken');
const signServiceToken = require('../src/utils/signServiceToken');

jest.mock('jsonwebtoken');

describe('signServiceToken', () => {
    beforeEach(() => {
        process.env.SERVICE_NAME = 'user-service';
        process.env.SERVICE_JWT_SECRET = 'super-secret';
        jwt.sign.mockClear();
    });

    it('should sign token with provided service name', () => {
        signServiceToken('custom-service');
        expect(jwt.sign).toHaveBeenCalledWith(
            { from: 'custom-service' },
            'super-secret',
            { expiresIn: '2m' }
        );
    });

    it('should fallback to process.env.SERVICE_NAME', () => {
        signServiceToken();
        expect(jwt.sign).toHaveBeenCalledWith(
            { from: 'user-service' },
            'super-secret',
            { expiresIn: '2m' }
        );
    });

    it('should fallback to "unknown-service" if no service name or env', () => {
        delete process.env.SERVICE_NAME;
        signServiceToken();
        expect(jwt.sign).toHaveBeenCalledWith(
            { from: 'unknown-service' },
            'super-secret',
            { expiresIn: '2m' }
        );
    });
});