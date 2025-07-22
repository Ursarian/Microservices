const auth = require('../src/middleware/auth');

describe('auth middleware', () => {
    it('should return 401 if no token is provided', () => {
        const req = {
            header: jest.fn().mockReturnValue(null)
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn() // <-- Add this line
        };
        const next = jest.fn();

        auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'No token. Access denied. null'
        });
    });
});
