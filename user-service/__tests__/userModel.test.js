const mongoose = require('mongoose');
const User = require('../src/models/user');

describe('User Model', () => {
    it('should be invalid if email is empty', () => {
        const user = new User({ password: 'test123' });
        const err = user.validateSync();
        expect(err.errors.email).toBeDefined();
    });

    it('should be invalid if password is empty', () => {
        const user = new User({ email: 'test@example.com' });
        const err = user.validateSync();
        expect(err.errors.password).toBeDefined();
    });

    it('should be valid with email and password', () => {
        const user = new User({ email: 'test@example.com', password: 'test123' });
        const err = user.validateSync();
        expect(err).toBeUndefined();
    });

    it('should default role to user', () => {
        const user = new User({ email: 'test@example.com', password: 'test123' });
        expect(user.role).toBe('user');
    });

    it('should throw error on invalid role', () => {
        const user = new User({ email: 'test@example.com', password: 'test123', role: 'hacker' });
        const err = user.validateSync();
        expect(err.errors.role).toBeDefined();
    });
});