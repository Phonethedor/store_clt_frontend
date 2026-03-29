<template>
    <div class="orders-page animate-fade-in">
        <div class="container">
            <header class="orders-header">
                <h1>Mis Pedidos</h1>
                <p class="subtitle">Gestiona y revisa el estado de tus compras pasadas.</p>
            </header>

            <div v-if="loading" class="orders-loading">
                <div class="spinner"></div>
                <p>Cargando historial...</p>
            </div>

            <div v-else-if="orders.length === 0" class="empty-orders glassmorphism">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6m-3-3h6" />
                </svg>
                <h2>Aún no tienes pedidos</h2>
                <p>¡Tus compras aparecerán aquí una vez que las realices!</p>
                <router-link to="/" class="btn-primary shop-now-btn">Empezar a comprar</router-link>
            </div>

            <div v-else class="orders-list">
                <div v-for="order in orders" :key="order.id" class="order-card glassmorphism">
                    <div class="order-id-section">
                        <span class="order-label">PEDIDO #{{ order.id.slice(0, 8).toUpperCase() }}</span>
                        <span class="order-date">{{ formatDate(order.created_at) }}</span>
                    </div>

                    <div class="order-content">
                        <div class="products-preview">
                            <div v-for="item in order.order_items" :key="item.id" class="preview-img-container"
                                :title="item.product?.name">
                                <img :src="`http://localhost:3021/public/${item.product?.image_url}`"
                                    :alt="item.product?.name">
                                <span class="qty-label">x{{ item.quantity }}</span>
                            </div>
                        </div>

                        <div class="order-financials">
                            <div class="status-container">
                                <span :class="['status-dot', order.status]"></span>
                                <span class="status-text">{{ capitalize(translateStatus(order.status)) }}</span>
                            </div>
                            <div class="total-price">
                                <span class="total-label">Total</span>
                                <span class="price-val">${{ formatPrice(order.total_price) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="order-footer">
                        <button class="btn-outline btn-sm">Ver Detalle Completo</button>
                        <button v-if="order.status === 'pending'" class="btn-text btn-sm">Cancelar Pedido</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import tiendaApi from '../api/tiendaApi';

const authStore = useAuthStore();
const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
    try {
        const response = await tiendaApi.get(`/orders/user/${authStore.user.id}`);
        orders.value = response.data.data;
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchOrders);

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-CL', options);
};

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const translateStatus = (status) => {
    const statuses = {
        'pending': 'Pendiente',
        'paid': 'Pagado',
        'canceled': 'Cancelado',
        'shipped': 'Enviado'
    };
    return statuses[status] || status;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<style scoped>
.orders-page {
    padding-top: 140px;
    min-height: 100vh;
    padding-bottom: 80px;
}

.orders-header {
    margin-bottom: 40px;
}

.subtitle {
    color: var(--text-muted);
    margin-top: 8px;
}

.orders-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 100px 0;
}

.empty-orders {
    text-align: center;
    padding: 80px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
}

.shop-now-btn {
    margin-top: 10px;
}

.orders-list {
    display: grid;
    gap: 25px;
}

.order-card {
    padding: 30px;
    border-radius: 12px;
    transition: transform 0.3s;
}

.order-card:hover {
    transform: translateY(-4px);
}

.order-id-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 15px;
}

.order-label {
    font-weight: 700;
    letter-spacing: 1px;
    font-size: 0.85rem;
}

.order-date {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.order-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
}

.products-preview {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.preview-img-container {
    position: relative;
    width: 60px;
    height: 70px;
    background: var(--gray-100);
    border-radius: 8px;
    overflow: hidden;
}

.preview-img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.qty-label {
    position: absolute;
    top: -5px;
    right: -5px;
    background: var(--charcoal);
    color: var(--white);
    font-size: 0.65rem;
    padding: 2px 6px;
    border-radius: 50%;
    border: 2px solid var(--white);
}

.order-financials {
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.status-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.status-dot.pending {
    background: #f1c40f;
    box-shadow: 0 0 10px #f1c40f66;
}

.status-dot.paid {
    background: #2ecc71;
    box-shadow: 0 0 10px #2ecc7166;
}

.status-dot.canceled {
    background: #e74c3c;
    box-shadow: 0 0 10px #e74c3c66;
}

.status-text {
    font-size: 0.9rem;
    font-weight: 600;
}

.price-val {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    margin-top: 4px;
}

.total-label {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--text-muted);
}

.order-footer {
    margin-top: 30px;
    display: flex;
    gap: 15px;
}

@media (max-width: 768px) {
    .order-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .order-financials {
        text-align: left;
        align-items: flex-start;
    }
}

[data-theme='dark'] .preview-img-container {
    background: var(--white);
}

[data-theme='dark'] .order-card {
    background: rgba(255, 255, 255, 0.03);
}
</style>
