import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';
const USERS = process.env.REACT_APP_USER_PATH || '/users';

// GET profile
export async function getProfile(token) {
    try {
        const res = await axios.get(`${API_BASE}${USERS}/profile`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('getProfile error:', err);
        throw err;
    }
}

// POST register
export async function registerUser(data) {
    try {
        const res = await axios.post(`${API_BASE}${USERS}/register`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error('registerUser error:', err);
        throw err;
    }
}

// POST login
export async function loginUser(data) {
    try {
        const res = await axios.post(`${API_BASE}${USERS}/login`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error('loginUser error:', err);
        throw err;
    }
}
