import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userAPI';
import AlertBox from '../components/AlertBox';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const data = await loginUser({ email, password });
            login(data.token);
            setAlert({ type: 'success', message: data.message || 'Login successful!' });
            setTimeout(() => {
                navigate('/profile');
            }, 1000);
        } catch (err) {
            const msg = err.response?.data?.message
                || err.message
                || "Unexpected response";
            setAlert({ type: 'error', message: msg });
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Login</h2>
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
            <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert({})} />
        </div>
    );
}

export default Login;