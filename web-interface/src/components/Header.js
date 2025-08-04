import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './Header.module.css';

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
        <nav className={styles.navbar}>
            {!token ? (
                <>
                    <Link to="/login" className={styles.navLink}>Login</Link>
                    <Link to="/register" className={styles.navLink}>Register</Link>
                </>
            ) : (
                <>
                    <Link to="/profile" className={styles.navLink}>Profile</Link>
                    <Link to="/products" className={styles.navLink}>Products</Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                </>
            )}
        </nav>
    );
}

export default Header;