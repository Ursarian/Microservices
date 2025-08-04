import React, { useState } from 'react';
import { registerUser } from '../api/userApi';
import AlertBox from '../components/AlertBox';
import styles from './Auth.module.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ type: '', message: '' });

    const handleRegister = async () => {
        try {
            await registerUser({ email, password });
            setAlert({ type: 'success', message: 'Registration successful' });
        } catch (err) {
            const msg = err.response?.data?.message
                || err.message
                || "Unexpected response";
            setAlert({ type: 'error', message: msg });
        }
    };

    return (
        <div className={styles.container}>
            <h2>Register</h2>
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleRegister}>
                Submit
            </button>
            <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert({})} />
        </div>
    );
}

export default Register;