const BASE_URL = 'http://localhost:3302/products';

export async function fetchProducts() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function createProduct(product) {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
}
