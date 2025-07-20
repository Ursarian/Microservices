import axios from 'axios';

const USER_SERVICE_URI = process.env.REACT_APP_USER_SERVICE || '/users';

// GET profile
export async function getProfile(token) {
    try {
        const res = await axios.get(`${USER_SERVICE_URI}/profile`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        console.error('Fetch profile failed:', err);
        return null;
    }
}

// POST register
export async function registerUser(data) {
    try {
        const res = await axios.post(`${USER_SERVICE_URI}/register`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error('Register failed:', err);
        return null;
    }
}

// POST login
export async function loginUser(data) {
    try {
        const res = await axios.post(`${USER_SERVICE_URI}/login`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        return res.data;
    } catch (err) {
        console.error('Login failed:', err);
        return null;
    }
}
