import { defineStore } from 'pinia';
import tiendaApi from '../api/tiendaApi';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userName: (state) => state.user?.full_name || 'Usuario'
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const response = await tiendaApi.post('/auth/login', credentials);
                const { token, usuario } = response.data;

                this.token = token;
                this.user = usuario;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(usuario));

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al iniciar sesión';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async register(userData) {
            this.loading = true;
            try {
                await tiendaApi.post('/auth/registro', userData);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al registrarse';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Informamos al backend para que destruya la sesion
            tiendaApi.get('/auth/logout').catch(() => { });
        }
    }
});
