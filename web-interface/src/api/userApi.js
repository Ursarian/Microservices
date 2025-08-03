import axios from 'axios';
const { buildServiceUri } = require('../utils/buildServiceUri');

const USER_SERVICE_URI = buildServiceUri('USER');

// GET Profile
export async function getProfile(token) {
    try {
        const res = await axios.get(`${USER_SERVICE_URI}/profile`,
            {
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

// POST Register
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

// POST Login
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

// GET All Users
export async function fetchAllUsers(token) {
    try {
        const res = await axios.get(`${USER_SERVICE_URI}/all`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
        return res.data;
    } catch (err) {
        console.error('fetchAllUsers error:', err);
        throw err;
    }
}

// DELETE Me
export async function deleteProfile(token) {
    try {
        const res = await axios.delete(`${USER_SERVICE_URI}/me`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });
        return res.data;
    } catch (err) {
        console.error('deleteProfile error:', err);
        throw err;
    }
}