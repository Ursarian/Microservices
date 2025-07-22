import React from 'react';

function ProductList({ products }) {
    if (!Array.isArray(products)) return <div>Invalid data</div>;
    if (products.length === 0) return <div>No products found</div>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th><th>Description</th><th>Price</th>
                </tr>
            </thead>
            <tbody>
                {products.map(p => (
                    <tr key={p._id}>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>{p.price}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


export default ProductList;
