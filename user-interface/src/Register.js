import React, { useState } from 'react';
import { registerUser } from './services/api';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            await registerUser({ email, password });
        } catch (err) {
            alert('Error: ' + err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input type="email" onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleRegister}>Submit</button>
        </div>
    );
}

export default Register;