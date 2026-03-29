import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/homeView.vue';
import { useAuthStore } from '../stores/auth';

const routes = [
    { path: '/', name: 'home', component: HomeView },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: { guest: true }
    },
    {
        path: '/registro',
        name: 'register',
        component: () => import('../views/RegisterView.vue'),
        meta: { guest: true }
    },
    {
        path: '/categoria/:id',
        name: 'category',
        component: () => import('../views/CategoryView.vue'),
        props: true
    },
    {
        path: '/cuenta',
        name: 'account',
        component: () => import('../views/AccountView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/carrito',
        name: 'cart',
        component: () => import('../views/CartView.vue')
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('../views/CheckoutView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/mis-pedidos',
        name: 'orders',
        component: () => import('../views/OrdersView.vue'),
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard para evitar que los usuarios logueados visiten Login/Register
router.beforeEach((to, from, next) => {
    const auth = useAuthStore();
    if (to.meta.guest && auth.isAuthenticated) {
        next('/');
    } else if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router;
