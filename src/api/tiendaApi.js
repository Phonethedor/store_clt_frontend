import axios from 'axios';

const tiendaApi = axios.create({
    baseURL: 'http://localhost:3021/api/v1',
    withCredentials: true
});

// Agregamos el token a cada peticion si existe
tiendaApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default tiendaApi;
