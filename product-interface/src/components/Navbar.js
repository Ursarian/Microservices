import React from 'react';

const Navbar = () => {
    const userUrl = process.env.REACT_APP_USER_INTERFACE;
    const productUrl = process.env.REACT_APP_PRODUCT_INTERFACE;

    return (
        <nav
            style={{
                padding: '1rem',
                background: '#f4f4f4',
                position: 'relative',
                zIndex: 1
            }}
        >
            <a href={userUrl} style={{ marginRight: '1rem' }}>User</a>
            <a href={productUrl}>Products</a>
        </nav>
    );
};

export default Navbar;
