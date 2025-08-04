import React from 'react';
import styles from './ProductList.module.css';

function ProductList({ products, onEdit, onDelete }) {
    if (!Array.isArray(products)) return <div>Invalid data</div>;
    if (products.length === 0) return <div>No products found</div>;

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th><th>Name</th><th>Description</th><th>Price</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(p => (
                    <tr key={p._id}>
                        <td>{p._id}</td>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{p.price}</td>
                        <td className={styles.actions}>
                            <button onClick={() => onEdit(p)} className={`${styles.btn} ${styles.editBtn}`}>Edit</button>
                            <button onClick={() => onDelete(p._id)} className={`${styles.btn} ${styles.deleteBtn}`}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ProductList;