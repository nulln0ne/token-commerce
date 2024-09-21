import axios from 'axios';
import { API_URL } from '../../app/config';
import { useAuthStore } from '../stores/authStore';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
