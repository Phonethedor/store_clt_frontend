import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/homeView.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    /*
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue') // Carga perezosa
    }
    */
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;