import axios from 'axios';

const BASE_URL = process.env.REACT_APP_PRODUCT_SERVICE;

export async function fetchProducts() {
    try {
        const res = await axios.get('/products');
        return res.data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return []; // Fallback to prevent frontend crash
    }
}

export async function createProduct(product) {
    try {
        const res = await axios.post('/products', product);
        return res.data;
    } catch (err) {
        console.error("Create failed:", err);
        return []; // Fallback to prevent frontend crash
    }
}
