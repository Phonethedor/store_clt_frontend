import { defineStore } from 'pinia';
import authService from '../services/auth.service';
import userService from '../../account/services/user.service';
import router from '../../../router';
import { useCartStore } from '../../cart/store/cart.store';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        userName: (state) => state.user?.fullName || 'Usuario'
    },

    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                const data = await authService.login(credentials);
                const { token, usuario } = data;

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
                await authService.register(userData);
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
            
            // Limpiamos el carrito
            const cartStore = useCartStore();
            cartStore.clearCart();

            // Informamos al backend para que destruya la sesion
            authService.logout().catch(() => { });

            // Redireccionamos al home
            router.push('/');
        },

        async updateUser(userData) {
            this.loading = true;
            this.error = null;
            try {
                const data = await userService.update(this.user.id, userData);
                this.user = data;
                localStorage.setItem('user', JSON.stringify(this.user));
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al actualizar información';
                throw err;
            } finally {
                this.loading = false;
            }
        }
    }
});
