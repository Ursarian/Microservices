import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Header() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const savedToken = localStorage.getItem('authToken');
    //     if (savedToken) setToken(savedToken);

    //     const syncToken = () => {
    //         const updatedToken = localStorage.getItem('authToken');
    //         setToken(updatedToken || '');
    //     };

    //     window.addEventListener('storage', syncToken);
    //     return () => window.removeEventListener('storage', syncToken);
    // }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '10px', background: '#eee' }}>
            {!token ? (
                <>
                    <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                    <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
                </>
            ) : (
                <>
                    <Link to="/profile" style={{ marginRight: '10px' }}>Profile</Link>
                    <Link to="/products" style={{ marginRight: '10px' }}>Products</Link>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
                </>
            )}
        </nav>
    );
}

export default Header;