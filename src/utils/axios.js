import axios from 'axios';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosInstance };