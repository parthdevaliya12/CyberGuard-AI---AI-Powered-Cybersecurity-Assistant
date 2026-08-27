import axios from 'axios';

// Automatically switch between live and local backend
const isProduction = import.meta.env.PROD || window.location.hostname !== 'localhost';
const baseURL = import.meta.env.VITE_API_URL || (isProduction ? 'https://cyberguard-ai-ai-powered-cybersecurity.onrender.com/api' : 'http://localhost:5000/api');

const API = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
