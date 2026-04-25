import axios from 'axios';
import { ENV } from '../core/config/env.config';
import { APP_CONSTANTS } from '../core/constants/app.constants';

const tiendaApi = axios.create({
    baseURL: ENV.API_URL,
    withCredentials: true
});

// Agregamos el token a cada peticion si existe
tiendaApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default tiendaApi;
