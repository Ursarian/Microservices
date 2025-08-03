import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../api/userApi';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, fetchProductsByUser } from '../api/productApi';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import AlertBox from '../components/AlertBox';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProductPage() {
    const [products, setProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!selectedUserId || selectedUserId === '*') {
            fetchAllProducts(token)
                .then(setProducts)
                .catch(console.error);
        } else {
            fetchProductsByUser(selectedUserId, token)
                .then(setProducts)
                .catch(console.error);
        }
    }, [selectedUserId]);

    useEffect(() => {
        fetchAllUsers()
            .then(setUsers)
            .catch(console.error);
    }, []);

    function handleAdd(product) {
        createProduct(product, token)
            .then(p => setProducts(prev => [...prev, p]))
            .catch(console.error);
    }

    function handleUpdate(id, updatedProduct) {
        updateProduct(id, updatedProduct, token)
            .then(p => {
                setProducts(prev => prev.map(item => item._id === id ? p : item));
                setEditProduct(null);
                setAlert({ type: 'success', message: 'Update successful' });
            })
            .catch(err => {
                const msg = err.response?.data?.message
                    || err.message
                    || "Unexpected response";
                setAlert({ type: 'error', message: msg });
                console.error(err);
            });
    }

    function handleDelete(id) {
        deleteProduct(id, token)
            .then(() => {
                setProducts(prev => prev.filter(p => p._id !== id));
                setAlert({ type: 'success', message: 'Deletion successful' });
            })
            .catch(err => {
                const msg = err.response?.data?.message
                    || err.message
                    || "Unexpected response";
                setAlert({ type: 'error', message: msg });
                console.error(err);
            });
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Product Catalog</h1>
            <ProductForm onAdd={handleAdd} onUpdate={handleUpdate} editProduct={editProduct} />
            <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert({})} />
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