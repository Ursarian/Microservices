const sanitize = str => str.replace(/^[\/\\]+|[\/\\]+$/g, '');

function buildServiceUri(name) {
    const base = sanitize(process.env[`REACT_APP_API_BASE_URL`] || 'api');
    const version = sanitize(process.env[`REACT_APP_${name}_VERSION`] || 'v1');
    const path = sanitize(process.env[`REACT_APP_${name}_PATH`] || `${name.toLowerCase()}s`);

    return `/${base}/${version}/${path}`;
}

module.exports = { buildServiceUri };