import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';
const PRODUCTS = process.env.REACT_APP_PRODUCT_PATH || '/products';

export async function fetchProducts() {
    try {
        const res = await axios.get(`${API_BASE}${PRODUCTS}/all`,
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
        const PRODUCT_SERVICE_URI = `${API_BASE}${PRODUCTS}`;
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
