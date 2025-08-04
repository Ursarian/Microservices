const sanitize = str => str.replace(/^[\:\/\\]+|[\:\/\\]+$/g, '');

function buildServiceUri(name) {
    const domain = sanitize(process.env[`${name}_DOMAIN`] || `http://${name.toLowerCase()}-service`);
    const port = sanitize(process.env[`${name}_PORT`] || '3001');
    const base = sanitize(process.env[`API_BASE_URL`] || 'api');
    const version = sanitize(process.env[`${name}_VERSION`] || 'v1');
    const path = sanitize(process.env[`${name}_PATH`] || `${name.toLowerCase()}s`);

    return `${domain}:${port}/${base}/${version}/${path}`;
}

module.exports = { buildServiceUri };