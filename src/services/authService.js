import tiendaApi from '../api/tiendaApi';
import { User } from '../models/User';

const authService = {
    async login(credentials) {
        const response = await tiendaApi.post('/auth/login', credentials);
        return {
            token: response.data.token,
            usuario: new User(response.data.usuario)
        };
    },
    async register(userData) {
        const response = await tiendaApi.post('/auth/registro', userData);
        return response.data;
    },
    async logout() {
        return await tiendaApi.get('/auth/logout');
    }
};

export default authService;
