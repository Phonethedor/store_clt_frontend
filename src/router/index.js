import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../modules/catalog/views/HomeView.vue';
import { useAuthStore } from '../modules/auth/store/auth.store';

const routes = [
    { path: '/', name: 'home', component: HomeView },
    {
        path: '/login',
        name: 'login',
        component: () => import('../modules/auth/views/LoginView.vue'),
        meta: { guest: true }
    },
    {
        path: '/registro',
        name: 'register',
        component: () => import('../modules/auth/views/RegisterView.vue'),
        meta: { guest: true }
    },
    {
        path: '/categoria/:id',
        name: 'category',
        component: () => import('../modules/catalog/views/CategoryView.vue'),
        props: true
    },
    {
        path: '/categorias',
        name: 'categories',
        component: () => import('../modules/catalog/views/CategoriesView.vue')
    },
    {
        path: '/cuenta',
        name: 'account',
        component: () => import('../modules/account/views/AccountView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/carrito',
        name: 'cart',
        component: () => import('../modules/cart/views/CartView.vue')
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: () => import('../modules/cart/views/CheckoutView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/mis-pedidos',
        name: 'orders',
        component: () => import('../modules/orders/views/OrdersView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/nosotros',
        name: 'about',
        component: () => import('../shared/views/AboutView.vue')
    },
    {
        path: '/contacto',
        name: 'contact',
        component: () => import('../shared/views/ContactView.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../shared/views/NotFoundView.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
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
