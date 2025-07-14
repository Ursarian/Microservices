import React, { useState } from 'react';

function ProductForm({ onAdd }) {
    const [form, setForm] = useState({ name: '', description: '', price: '' });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAdd({ ...form, price: parseFloat(form.price) });
        setForm({ name: '', description: '', price: '' });
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default ProductForm;
