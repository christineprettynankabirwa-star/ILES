import axios from 'axios';

// Create a central instance explicitly targeted at your Django dev server
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default API;