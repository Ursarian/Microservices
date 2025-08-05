module.exports = async function retry(fn, {
    retries = 5,
    delay = 1000
} = {}) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            console.warn(`Retry attempt ${attempt}/${retries} failed: ${err.message}`);
            if (attempt < retries) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
    throw lastError;
};
