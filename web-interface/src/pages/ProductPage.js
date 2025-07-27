import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchProductsByUser } from '../api/productApi';
import { fetchUsers } from '../api/userAPI';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!selectedUserId || selectedUserId === '*') {
            fetchProducts()
                .then(setProducts)
                .catch(console.error);
        } else {
            fetchProductsByUser(selectedUserId)
                .then(setProducts)
                .catch(console.error);
        }
    }, [selectedUserId]);

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch(console.error);
    }, []);

    function handleAdd(product) {
        createProduct(product, token)
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
            <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
                <option value="*">-- All Products --</option>
                {users.map(user => (
                    <option key={user._id} value={user._id}>{user.email}</option>
                ))}
            </select>
            <ProductList
                products={products}
                onEdit={setEditProduct}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default ProductPage;