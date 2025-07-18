import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_USER_SERVICE, // change port if needed
});

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getProfile = (token) =>
    API.get('/profile', {
        headers: { Authorization: `Bearer ${token}`, },
    });