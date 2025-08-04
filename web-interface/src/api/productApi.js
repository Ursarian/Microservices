import axios from 'axios';
const { buildServiceUri } = require('../utils/buildServiceUri');

const PRODUCT_SERVICE_URI = buildServiceUri('PRODUCT');

// GET All Products
export async function fetchAllProducts(token) {
    try {
        console.log("productApi: ", token);
        const res = await axios.get(`${PRODUCT_SERVICE_URI}/all`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data;
    } catch (err) {
        console.error('fetchProducts error:', err);
        throw err;
    }
}

// GET Products by User ID
export async function fetchProductsByUser(userId, token) {
    try {
        const res = await axios.get(`${PRODUCT_SERVICE_URI}/by-owner/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (err) {
        console.error('fetchProductsByUser error:', err);
        throw err;
    }
}

// POST Products
export async function createProduct(product, token) {
    try {
        const res = await axios.post(PRODUCT_SERVICE_URI,
            product,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (err) {
        console.error('createProduct error:', err);
        throw err;
    }
}

// PUT Product
export async function updateProduct(id, product, token) {
    try {
        const res = await axios.put(`${PRODUCT_SERVICE_URI}/id/${id}`,
            product,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (err) {
        console.error('updateProduct error:', err);
        throw err;
    }
}

// DELETE Product
export async function deleteProduct(id, token) {
    try {
        const res = await axios.delete(`${PRODUCT_SERVICE_URI}/id/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (err) {
        console.error('deleteProduct error:', err);
        throw err;
    }
}