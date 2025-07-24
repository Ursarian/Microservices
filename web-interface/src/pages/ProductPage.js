import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);

    useEffect(() => {
        fetchProducts()
            .then(setProducts)
            .catch(console.error);
    }, []);

    function handleAdd(product) {
        createProduct(product)
            .then(p => setProducts(prev => [...prev, p]))
            .catch(console.error);
    }

    function handleUpdate(id, updatedProduct) {
        updateProduct(id, updatedProduct)
            .then(p => {
                setProducts(prev => prev.map(item => item._id === id ? p : item));
                setEditProduct(null);
            })
            .catch(console.error);
    }

    function handleDelete(id) {
        deleteProduct(id)
            .then(() => setProducts(prev => prev.filter(p => p._id !== id)))
            .catch(console.error);
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Product Catalog</h1>
            <ProductForm onAdd={handleAdd} onUpdate={handleUpdate} editProduct={editProduct} />
            <ProductList
                products={products}
                onEdit={setEditProduct}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default ProductPage;