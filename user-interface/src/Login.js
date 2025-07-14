import React, { useState } from 'react';
import { loginUser } from './services/api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    const handleLogin = async () => {
        try {
            const res = await loginUser({ email, password });
            if (res && res.data) {
                const token = res.data.token;
                // Store token for future use (e.g., protected routes)
                localStorage.setItem('authToken', token);
                alert("Login successful!");
            } else {
                alert("Unexpected response from server");
            }
        } catch (err) {
            alert('Login failed: ' + err.response.data.message);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
            {token && <p>Token: {token}</p>}
        </div>
    );
}

export default Login;