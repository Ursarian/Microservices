const auth = require('../src/middleware/auth');

describe('auth middleware', () => {
    it('should return 400 if no token is provided', () => {
        process.env.E400_CLIENT_BAD_TOKEN = 'Authentication token is missing or malformed';

        const req = {
            header: jest.fn().mockReturnValue(null)
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() // <-- Add this line
        };
        const next = jest.fn();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E400_BAD_TOKEN',
            message: 'Authentication token is missing or malformed'
        });
    });
});
