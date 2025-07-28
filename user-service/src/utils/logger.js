const SERVICE_NAME = process.env.SERVICE_NAME || 'user-service';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const STRUCTURED = process.env.ENABLE_STRUCTURED_LOGS === 'true';

function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();

    if (!STRUCTURED) {
        console.log(`[${level.toUpperCase()}] [${SERVICE_NAME}] ${message}`);
        if (Object.keys(meta).length) console.log(meta);
        return;
    }

    const logData = {
        level,
        service: SERVICE_NAME,
        message,
        timestamp,
        ...meta
    };

    const output = JSON.stringify(logData);
    level === 'error' ? console.error(output) : console.log(output);
}

module.exports = {
    info: (msg, meta) => {
        if (LOG_LEVEL === 'info') log('info', msg, meta);
    },
    error: (msg, meta) => {
        log('error', msg, meta);
    }
};