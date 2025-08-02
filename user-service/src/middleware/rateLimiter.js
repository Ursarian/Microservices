const logger = require('../utils/logger');

const requestLogs = new Map();

const WINDOW_MS = 10 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

const createLimiter = (maxRequests, maxBurst, burst_cooldown) => {
    const store = new Map();
    const BURST_REFILL_MS = burst_cooldown || 5 * 60 * 1000;

    const limiter = (req, res, next) => {
        const id = req.user?.userId || req.ip;
        const now = Date.now();

        if (!store.has(id)) {
            store.set(id, {
                timestamps: [],
                tokens: maxBurst,
                lastRefill: now
            });
        }

        const data = store.get(id);

        // 1. Refill tokens
        const elapsed = now - data.lastRefill;
        const refillCount = Math.floor(elapsed / BURST_REFILL_MS);
        if (refillCount > 0) {
            data.tokens = Math.min(data.tokens + refillCount, maxBurst);
            data.lastRefill = now;
        }

        // 2. Remove expired requests
        data.timestamps = data.timestamps.filter(ts => now - ts < WINDOW_MS);

        // 3. Main limit logic
        if (data.timestamps.length >= maxRequests) {
            if (data.tokens > 0) {
                data.tokens -= 1; // Use one burst token
            } else {
                logger.error(process.env.E429_TOO_MANY_REQUESTS, { id });
                return res.status(429).json({
                    code: 'E429_TOO_MANY_REQUESTS',
                    message: process.env.E429_CLIENT_TOO_MANY_REQUESTS
                });
            }
        }

        // 4. Accept request
        data.timestamps.push(now);
        store.set(id, data);
        next();
    };

    return limiter;
};

function startRateLimitCleanup() {
    setInterval(() => {
        const now = Date.now();

        for (const [key, data] of requestLogs.entries()) {
            data.timestamps = data.timestamps.filter(ts => now - ts < WINDOW_MS);

            const tokensFull = data.tokens === undefined || data.tokens > 0;
            const inactive = data.timestamps.length === 0;

            if (inactive && tokensFull) {
                requestLogs.delete(key);
            } else {
                requestLogs.set(key, data);
            }
        }
    }, CLEANUP_INTERVAL_MS);
}

module.exports = {
    loginRateLimiter: createLimiter(3, 1, 60 * 1000),
    usersRateLimiter: createLimiter(10, 2, 30 * 1000),
    rateLimiterFallback: createLimiter(50, 10, 6 * 1000),
    startRateLimitCleanup
};