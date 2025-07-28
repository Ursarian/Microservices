import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, deleteProfile } from '../api/userApi';
import AlertBox from '../components/AlertBox';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './Auth.module.css';

function Profile() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { token, logout } = useContext(AuthContext);

    useEffect(() => {
        if (!token) return;

        getProfile(token)
            .then(data => {
                setEmail(data.email);
            })
            .catch(err => {
                console.error("Profile fetch threw", err);
                setAlert({ type: 'error', message: 'Unauthorized or token expired' });
                // setTimeout(() => {
                //     navigate('/profile');
                // }, 1000);
            });
    }, []);

    async function handleDelete() {
        const confirm = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
        if (!confirm) return;

        try {
            await deleteProfile(token);
            logout(); // Clear local token
            navigate('/login'); // Redirect
        } catch (err) {
            console.error('Delete failed:', err);
            setAlert({ type: 'error', message: 'Failed to delete your profile' });
        }
    }

    return (
        <div className={styles.container}>
            <h2>Welcome to your profile</h2>
            <p>
                Email: {email}
            </p>
            <p style={{ wordBreak: 'break-all' }}>
                Token: <code>{token}</code>
            </p>
            <button className={styles.dangerBtn} onClick={handleDelete}>
                Delete Profile
            </button>
            <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert({})} />
        </div>
    );
}

export default Profile;