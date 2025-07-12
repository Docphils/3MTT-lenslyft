import axios from './axiosInstance';

const aiAPI = axios.create({
  baseURL: process.env.REACT_APP_API_BASE + '/ai',
  headers: {
    'Content-Type': 'application/json',
  },
 // withCredentials: true, // if using secure cookies
});

export default aiAPI;
