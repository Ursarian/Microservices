import React, { useState } from 'react';
import { loginUser } from './api/userAPI';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const data = await loginUser({ email, password });
            localStorage.setItem('authToken', data.token);
            alert(data.message || 'Login successful!');
        } catch (err) {
            // axios error → err.response.data.message should exist
            const msg = err.response?.data?.message
                || err.message
                || "Unexpected response from server";
            alert(msg);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;