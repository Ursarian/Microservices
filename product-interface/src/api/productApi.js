import axios from 'axios';

const BASE_URL = process.env.REACT_APP_PRODUCT_SERVICE;

export async function fetchProducts() {
    try {
        const res = await axios.get(BASE_URL);
        return res.data;
    } catch (err) {
        throw new Error('Failed to fetch products');
    }
}

export async function createProduct(product) {
    try {
        const res = await axios.post(BASE_URL, product);
        return res.data;
    } catch (err) {
        throw new Error('Failed to create product');
    }
}
