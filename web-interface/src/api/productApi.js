import axios from 'axios';

const sanitize = str => str.replace(/^\/+|\/+$/g, '');
const API_BASE = sanitize(process.env.REACT_APP_API_BASE_URL || '/api');
const API_VERSION = sanitize(process.env.REACT_APP_PRODUCT_VERSION || '/v1');
const PRODUCT_PATH = sanitize(process.env.REACT_APP_PRODUCT_PATH || '/products');
const PRODUCT_SERVICE_URI = `/${API_BASE}/${API_VERSION}/${PRODUCT_PATH}`;

export async function fetchProducts() {
    try {
        const res = await axios.get(`${PRODUCT_SERVICE_URI}/all`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error('fetchProducts error:', err);
        throw err;
    }
}

export async function createProduct(product) {
    try {
        const res = await axios.post(PRODUCT_SERVICE_URI,
            product,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error('createProduct error:', err);
        throw err;
    }
}

export async function updateProduct(id, product) {
    try {
        const res = await axios.put(`${PRODUCT_SERVICE_URI}/${id}`, product, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
    } catch (err) {
        console.error('updateProduct error:', err);
        throw err;
    }
}

export async function deleteProduct(id) {
    try {
        const res = await axios.delete(`${PRODUCT_SERVICE_URI}/${id}`, {
            headers: { 'Content-Type': 'application/json' }
        });
        return res.data;
    } catch (err) {
        console.error('deleteProduct error:', err);
        throw err;
    }
}