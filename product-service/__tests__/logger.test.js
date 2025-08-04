describe('Logger Utility', () => {
    const test_path = '../src/utils/logger';

    beforeEach(() => {
        process.env.SERVICE_NAME = 'test-service';
        process.env.LOG_LEVEL = 'info';
        process.env.ENABLE_STRUCTURED_LOGS = 'true';

        jest.resetModules();
        console.log = jest.fn();
        console.error = jest.fn();

        logger = require(test_path);
    });

    it('should log info', () => {
        logger.info('Testing info', { test: true });
        expect(console.log).toHaveBeenCalled();
    });

    it('should log error', () => {
        logger.error('Testing error', { test: true });
        expect(console.error).toHaveBeenCalled();
    });

    it('should log plain output when STRUCTURED is disabled', () => {
        process.env.ENABLE_STRUCTURED_LOGS = 'false';

        jest.resetModules();
        console.log = jest.fn();

        const plainLogger = require(test_path);

        plainLogger.info('This should be plain text', { test: true });
        expect(console.log).toHaveBeenCalled();
    });

    it('should not log info when LOG_LEVEL is error', () => {
        process.env.LOG_LEVEL = 'error';

        jest.resetModules();
        console.log = jest.fn();

        const silentLogger = require(test_path);

        silentLogger.info('This should not be logged', { test: true });
        expect(console.log).not.toHaveBeenCalled();
    });

    it('Should use default environment variables if none are set, and function properly without metadata.', () => {
        delete process.env.SERVICE_NAME;
        delete process.env.LOG_LEVEL;
        delete process.env.ENABLE_STRUCTURED_LOGS;

        jest.resetModules();
        console.log = jest.fn();

        const fallbackLogger = require(test_path);

        fallbackLogger.info('Testing fallback');
        expect(console.log).toHaveBeenCalled();
    });
});