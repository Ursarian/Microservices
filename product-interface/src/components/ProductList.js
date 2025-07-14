import React from 'react';

function ProductList({ products }) {
    return (
        <ul>
            {products.map(p => (
                <li key={p._id}>
                    <strong>{p.name}</strong> - ${p.price} <br />
                    {p.description}
                </li>
            ))}
        </ul>
    );
}

export default ProductList;
