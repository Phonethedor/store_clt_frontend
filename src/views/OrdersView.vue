<template>
    <div class="orders-page animate-fade-in">
        <div class="container">
            <header class="orders-page__header header-orders-view">
                <h1 class="header-orders-view__title">Mis Pedidos</h1>
                <p class="header-orders-view__subtitle">Gestiona y revisa el estado de tus compras pasadas.</p>
            </header>

            <div v-if="loading" class="orders-page__loading">
                <div class="loading-state__spinner"></div>
                <p>Cargando historial...</p>
            </div>

            <div v-else-if="orders.length === 0" class="orders-page__empty">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.3">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6m-3-3h6" />
                </svg>
                <h2>Aún no tienes pedidos</h2>
                <p>¡Tus compras aparecerán aquí una vez que las realices!</p>
                <BaseButton variant="primary" @click="router.push('/')">Empezar a comprar</BaseButton>
            </div>

            <div v-else class="orders-page__list">
                <div v-for="order in orders" :key="order.id" class="order-card-view">
                    <div class="order-card-view__header">
                        <span class="order-card-view__id">PEDIDO #{{ order.id.slice(0, 8).toUpperCase() }}</span>
                        <span class="order-card-view__date">{{ formatDate(order.createdAt) }}</span>
                    </div>

                    <div class="order-card-view__content">
                        <div class="previews-orders">
                            <div v-for="item in order.items.slice(0, 4)" :key="item.id" class="previews-orders__item"
                                :title="item.name">
                                <img :src="`http://localhost:3021/public/${item.imageUrl}`"
                                    :alt="item.name" class="previews-orders__img">
                                <span class="previews-orders__qty">x{{ item.quantity }}</span>
                            </div>
                            <div v-if="order.items.length > 4" class="previews-orders__more">
                                +{{ order.items.length - 4 }}
                            </div>
                        </div>

                        <div class="financials-orders">
                            <div class="status-orders">
                                <span :class="['status-orders__dot', `status-orders__dot--${order.status}`]"></span>
                                <span class="status-orders__text">{{ order.statusLabel }}</span>
                            </div>
                            <div class="financials-orders__total">
                                <span class="financials-orders__label">Total</span>
                                <span class="financials-orders__price">${{ formatPrice(order.totalPrice) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="order-card-view__footer">
                        <BaseButton variant="outline" size="sm" @click="showOrderDetail(order)">Ver Detalle Completo</BaseButton>
                        <BaseButton v-if="order.status === 'pending'" variant="text" size="sm" @click="handleCancelRequest">Cancelar Pedido</BaseButton>
                    </div>
                </div>

                <!-- Pagination -->
                <nav v-if="totalPages > 1" class="pagination-orders">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="pagination-orders__btn">
                        &laquo;
                    </button>
                    <button v-for="page in totalPages" :key="page" 
                        class="pagination-orders__btn"
                        :class="{ 'pagination-orders__btn--active': page === currentPage }"
                        @click="changePage(page)">
                        {{ page }}
                    </button>
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="pagination-orders__btn">
                        &raquo;
                    </button>
                </nav>
            </div>

            <!-- Order Detail Modal -->
            <Transition name="fade">
                <div v-if="selectedOrder" class="modal-orders" @click="selectedOrder = null">
                    <div class="modal-orders__content" @click.stop>
                        <header class="header-modal-orders">
                            <div class="header-modal-orders__info">
                                <h2 class="header-modal-orders__title">Detalle de Pedido</h2>
                                <p class="header-modal-orders__subtitle">#{{ selectedOrder.id.toUpperCase() }}</p>
                            </div>
                            <button class="header-modal-orders__close" @click="selectedOrder = null">&times;</button>
                        </header>

                        <div class="modal-orders__body">
                            <section class="section-modal-orders">
                                <h3 class="section-modal-orders__title">Productos</h3>
                                <div class="items-list-detail-orders">
                                    <div v-for="item in selectedOrder.items" :key="item.id" class="item-detail-orders">
                                        <img :src="`http://localhost:3021/public/${item.imageUrl}`"
                                            class="item-detail-orders__img">
                                        <div class="item-detail-orders__info">
                                            <span class="item-detail-orders__name">{{ item.name }}</span>
                                            <span class="item-detail-orders__meta">{{ item.quantity }} x ${{ formatPrice(item.price) }}</span>
                                        </div>
                                        <span class="item-detail-orders__subtotal">${{ formatPrice(item.price * item.quantity) }}</span>
                                    </div>
                                </div>
                            </section>

                            <div class="grid-details-orders">
                                <section class="section-modal-orders">
                                    <h3 class="section-modal-orders__title">Información de Envío</h3>
                                    <div class="section-modal-orders__content">
                                        <p><strong>Destinatario:</strong> {{ selectedOrder.fullName }}</p>
                                        <p><strong>Dirección:</strong> {{ selectedOrder.address }}</p>
                                        <p><strong>Ciudad:</strong> {{ selectedOrder.city }}, {{ selectedOrder.region }}</p>
                                    </div>
                                </section>

                                <section class="section-modal-orders">
                                    <h3 class="section-modal-orders__title">Pago y Estado</h3>
                                    <div class="section-modal-orders__content">
                                        <p><strong>Método de Pago:</strong> {{ selectedOrder.paymentMethod }}</p>
                                        <p><strong>Estado:</strong> {{ selectedOrder.statusLabel }}</p>
                                        <p><strong>Fecha:</strong> {{ formatDate(selectedOrder.createdAt) }}</p>
                                    </div>
                                </section>
                            </div>

                            <div class="total-display-orders">
                                <span class="total-display-orders__label">Total Pagado</span>
                                <span class="total-display-orders__amount">${{ formatPrice(selectedOrder.totalPrice) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { formatPrice } from '../utils/format';
import BaseButton from '../components/BaseButton.vue';
import orderService from '../services/orderService';

const router = useRouter();
const authStore = useAuthStore();
const orders = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const selectedOrder = ref(null);

const fetchOrders = async (page = 1) => {
    if (!authStore.user?.id) {
        loading.value = false;
        return;
    }

    loading.value = true;
    try {
        const data = await orderService.getByUserId(authStore.user.id, page, 10);
        
        if (data) {
            orders.value = data.orders || [];
            totalPages.value = data.totalPages || 1;
            currentPage.value = data.currentPage || 1;
        }
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
    } finally {
        loading.value = false;
    }
};

const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    fetchOrders(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showOrderDetail = (order) => {
    selectedOrder.value = order;
};

const handleCancelRequest = () => {
    alert('Funcionalidad de cancelación sujeta a políticas de la tienda. Contacta a soporte.');
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-CL', options);
};

const translateStatus = (status) => {
    const statuses = {
        'pending': 'Pendiente', 'paid': 'Pagado', 'canceled': 'Cancelado', 'shipped': 'Enviado'
    };
    return statuses[status] || status;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

watch(() => authStore.user, (newUser) => {
    if (newUser?.id) fetchOrders(1);
}, { deep: true, immediate: true });
</script>

<style lang="scss" src="../assets/styles/views/_orders.scss" scoped></style>
