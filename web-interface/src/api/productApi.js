import axios from 'axios';

const PRODUCT_SERVICE_URI = process.env.REACT_APP_PRODUCT_SERVICE || '/products';

export async function fetchProducts() {
    try {
        const res = await axios.get(PRODUCT_SERVICE_URI);
        return res.data;
    } catch (err) {
        console.error("Fetch failed:", err);
        return []; // Fallback to prevent frontend crash
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
        console.error("Create failed:", err);
        return []; // Fallback to prevent frontend crash
    }
}
