const authorizeOwnershipOrMinRole = require('../src/middleware/authorizeOwnershipOrRole');
const Product = require('../src/models/product');

jest.mock('../src/models/product');

describe('authorizeOwnershipOrMinRole middleware', () => {
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

    it('should return 404 if product is not found', async () => {
        Product.findById.mockResolvedValue(null);
        const req = { params: { id: '1' }, user: { userId: '123', role: 'user' } };

        await authorizeOwnershipOrMinRole('manager')(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ code: 'E404_PRODUCT_NOT_FOUND', message: 'Product not found' });
    });

    it('should return 403 if user is not owner and not elevated role', async () => {
        Product.findById.mockResolvedValue({ _id: '1', ownerId: '999' });
        const req = { params: { id: '1' }, user: { userId: '123', role: 'user' } };

        process.env.E403_CLIENT_FORBIDDEN = 'Forbidden';

        await authorizeOwnershipOrMinRole('manager')(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            code: 'E403_FORBIDDEN',
            message: 'Forbidden'
        });
    });

    it('should call next if user is owner', async () => {
        Product.findById.mockResolvedValue({ _id: '1', ownerId: '123' });
        const req = { params: { id: '1' }, user: { userId: '123', role: 'user' } };

        await authorizeOwnershipOrMinRole('manager')(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should call next if user has elevated role', async () => {
        Product.findById.mockResolvedValue({ _id: '1', ownerId: '456' });
        const req = { params: { id: '1' }, user: { userId: '123', role: 'admin' } };

        await authorizeOwnershipOrMinRole('manager')(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 500 if Product.findById throws error', async () => {
        Product.findById.mockRejectedValue(new Error('DB crash'));
        const req = { params: { id: '1' }, user: { userId: '123', role: 'user' } };

        await authorizeOwnershipOrMinRole('manager')(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Server error' }));
    });
});