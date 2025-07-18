import React, { useEffect, useState } from 'react';
import { getProfile } from './api/userAPI';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        getProfile(token)
            .then(res => setEmail(res.data.email))
            .catch(err => {
                alert('Unauthorized or token expired')
                navigate('/login')
            })
    }, []);

    return (
        <div>
            <h2>Welcome to your profile</h2>
            <p>Email: {email}</p>
        </div>
    );
}

export default Profile;