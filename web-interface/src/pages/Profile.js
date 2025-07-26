import React, { useEffect, useState } from 'react';
import { getProfile } from '../api/userAPI';
// import { useNavigate } from 'react-router-dom';
import AlertBox from '../components/AlertBox';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './Auth.module.css';

function Profile() {
    const [email, setEmail] = useState('');
    // const navigate = useNavigate();
    const [alert, setAlert] = useState({ type: '', message: '' });
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (!token) return;

        getProfile(token)
            .then(data => {
                console.log("Profile data", data);
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


    return (
        <div className={styles.container}>
            <h2>Welcome to your profile</h2>
            <p>Email: {email}</p>
            <p style={{ wordBreak: 'break-all' }}>
                Token: <code>{token}</code>
            </p>
            <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert({})} />
        </div>
    );
}

export default Profile;