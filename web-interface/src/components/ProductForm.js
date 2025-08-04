import React, { useEffect, useState } from 'react';
import styles from './ProductForm.module.css';

function ProductForm({ onAdd, onUpdate, editProduct }) {
    const [form, setForm] = useState({ _id: '', name: '', description: '', price: '' });

    useEffect(() => {
        if (editProduct) {
            setForm({
                _id: editProduct._id,
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price
            });
        }
    }, [editProduct]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const payload = { ...form, price: parseFloat(form.price) || 0 };
        if (editProduct) {
            onUpdate(editProduct._id, payload);
        } else {
            delete payload._id;
            onAdd(payload);
        }
        setForm({ name: '', description: '', price: '' });
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <input name="_id" placeholder="ID" value={form._id} onChange={handleChange} disabled />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <button type="submit">{editProduct ? 'Update' : 'Add'} Product</button>
        </form>
    );
}

export default ProductForm;