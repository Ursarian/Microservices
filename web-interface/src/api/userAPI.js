import axios from 'axios';

const sanitize = str => str.replace(/^\/+|\/+$/g, '');
const API_BASE = sanitize(process.env.REACT_APP_API_BASE_URL || '/api');
const API_VERSION = sanitize(process.env.REACT_APP_USER_VERSION || '/v1');
const USER_PATH = sanitize(process.env.REACT_APP_USER_PATH || '/users');
const USER_SERVICE_URI = `/${API_BASE}/${API_VERSION}/${USER_PATH}`;

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
        console.error('getProfile error:', err);
        throw err;
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
        console.error('registerUser error:', err);
        throw err;
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
        console.error('loginUser error:', err);
        throw err;
    }
}

// GET all users
export async function fetchUsers() {
    try {
        const res = await axios.get(`${USER_SERVICE_URI}/all`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return res.data;
    } catch (err) {
        console.error('fetchAllUsers error:', err);
        throw err;
    }
}
