import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/users', // change port if needed
});

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getProfile = (token) =>
    API.get('/profile', {
        headers: { Authorization: `Bearer ${token}`, },
    });