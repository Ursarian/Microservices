import React, { useState } from 'react';
import { loginUser } from './api/userAPI';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token] = useState('');

    const handleLogin = async () => {
        try {
            const data = await loginUser({ email, password });
            if (data && data.token) {
                localStorage.setItem('authToken', data.token);
                alert("Login successful!");
            } else if (data && data.message) {
                // this handles 400 responses turned into { message: "Invalid…" }
                alert(data.message);
            } else {
                alert("Unexpected response from server");
            }
        } catch (err) {
            // this only fires for network errors or if you remove the try/catch inside loginUser
            alert('Login failed: ' + (err.response?.data?.message || err.message));
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