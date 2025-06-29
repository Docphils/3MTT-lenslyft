import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://threemtt-lenslyft-api.onrender.com/api', // ✅ include /api
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
