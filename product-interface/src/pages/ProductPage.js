import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct } from '../api/productApi';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function ProductPage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error);
    }, []);

    function handleAdd(product) {
        createProduct(product)
            .then(p => setProducts(prev => [...prev, p]))
            .catch(console.error);
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Product Catalog</h1>
            <ProductForm onAdd={handleAdd} />
            <ProductList products={products} />
        </div>
    );
}

export default ProductPage;