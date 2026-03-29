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
                            <div v-for="item in order.order_items.slice(0, 4)" :key="item.id" class="preview-img-container"
                                :title="item.product?.name">
                                <img :src="`http://localhost:3021/public/${item.product?.image_url}`"
                                    :alt="item.product?.name">
                                <span class="qty-label">x{{ item.quantity }}</span>
                            </div>
                            <div v-if="order.order_items.length > 4" class="more-items-badge">
                                +{{ order.order_items.length - 4 }}
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
                        <button @click="showOrderDetail(order)" class="btn-outline btn-sm">Ver Detalle Completo</button>
                        <button v-if="order.status === 'pending'" class="btn-text btn-sm">Cancelar Pedido</button>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pagination-container">
                    <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)" class="page-btn">
                        &laquo;
                    </button>
                    <button v-for="page in totalPages" :key="page" :class="['page-btn', { active: page === currentPage }]"
                        @click="changePage(page)">
                        {{ page }}
                    </button>
                    <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)" class="page-btn">
                        &raquo;
                    </button>
                </div>
            </div>

            <!-- Order Detail Modal -->
            <Transition name="fade">
                <div v-if="selectedOrder" class="modal-overlay" @click="selectedOrder = null">
                    <div class="modal-content glassmorphism" @click.stop>
                        <header class="modal-header">
                            <div>
                                <h2>Detalle de Pedido</h2>
                                <p class="order-num">#{{ selectedOrder.id.toUpperCase() }}</p>
                            </div>
                            <button class="close-btn" @click="selectedOrder = null">&times;</button>
                        </header>

                        <div class="modal-body">
                            <section class="order-section">
                                <h3>Productos</h3>
                                <div class="items-list">
                                    <div v-for="item in selectedOrder.order_items" :key="item.id" class="item-row">
                                        <img :src="`http://localhost:3021/public/${item.product?.image_url}`"
                                            class="item-img">
                                        <div class="item-info">
                                            <span class="item-name">{{ item.product?.name }}</span>
                                            <span class="item-meta">{{ item.quantity }} x ${{ formatPrice(item.price) }}</span>
                                        </div>
                                        <span class="item-subtotal">${{ formatPrice(item.price * item.quantity) }}</span>
                                    </div>
                                </div>
                            </section>

                            <div class="details-grid">
                                <section class="order-section">
                                    <h3>Información de Envío</h3>
                                    <p><strong>Destinatario:</strong> {{ selectedOrder.full_name }}</p>
                                    <p><strong>Dirección:</strong> {{ selectedOrder.address }}</p>
                                    <p><strong>Ciudad:</strong> {{ selectedOrder.city }}, {{ selectedOrder.region }}</p>
                                </section>

                                <section class="order-section">
                                    <h3>Pago y Estado</h3>
                                    <p><strong>Método de Pago:</strong> {{ capitalize(selectedOrder.payment_method) }}</p>
                                    <p><strong>Estado:</strong> {{ capitalize(translateStatus(selectedOrder.status)) }}</p>
                                    <p><strong>Fecha:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                                </section>
                            </div>

                            <div class="modal-total">
                                <span>Total Pagado</span>
                                <span class="total-amount">${{ formatPrice(selectedOrder.total_price) }}</span>
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
import { useAuthStore } from '../stores/auth';
import tiendaApi from '../api/tiendaApi';

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
        const response = await tiendaApi.get(`/orders/user/${authStore.user.id}`, {
            params: {
                page,
                limit: 10
            }
        });
        
        if (response.data && response.data.data) {
            orders.value = response.data.data.orders || [];
            totalPages.value = response.data.data.totalPages || 1;
            currentPage.value = response.data.data.currentPage || 1;
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

onMounted(() => fetchOrders(1));

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

// Lifecycle & Watchers last
watch(() => authStore.user, (newUser) => {
    if (newUser?.id) {
        fetchOrders(1);
    }
}, { deep: true, immediate: true });

onMounted(() => {
    if (!authStore.user?.id) {
        loading.value = false;
    }
});
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

/* Pagination Styles */
.pagination-container {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 40px;
}

.page-btn {
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    color: var(--text-color);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--primary-color);
}

.page-btn.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

[data-theme='dark'] .modal-overlay {
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    background: #ffffff;
    color: #1a1a1a;
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    border-radius: 20px;
    padding: 40px;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] .modal-content {
    background: var(--background-page);
    color: var(--text-color);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    padding-bottom: 20px;
}

[data-theme='dark'] .modal-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
}

.order-num {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-top: 5px;
}

.btn-text.btn-sm {
    color: var(--text-muted);
}

[data-theme='dark'] .btn-text.btn-sm {
    color: var(--text-color);
    opacity: 0.8;
}

[data-theme='dark'] .btn-text.btn-sm:hover {
    color: #e74c3c;
    opacity: 1;
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--text-muted);
    cursor: pointer;
    line-height: 1;
}

.order-section {
    margin-bottom: 30px;
}

.order-section h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
    color: var(--primary-color);
}

.items-list {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 12px;
    padding: 20px;
    display: grid;
    gap: 15px;
}

[data-theme='dark'] .items-list {
    background: rgba(255, 255, 255, 0.05);
}

.item-row {
    display: flex;
    align-items: center;
    gap: 15px;
}

.item-img {
    width: 50px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    background: white;
}

.item-info {
    flex: 1;
}

.item-name {
    display: block;
    font-weight: 600;
}

.item-meta {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.item-subtotal {
    font-weight: 700;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.modal-total {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px solid rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

[data-theme='dark'] .modal-total {
    border-top-color: rgba(255, 255, 255, 0.05);
}

.total-amount {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary-color);
}

.more-items-badge {
    width: 60px;
    height: 70px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: var(--text-muted);
    border: 1px dashed rgba(255, 255, 255, 0.1);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

@media (max-width: 600px) {
    .details-grid {
        grid-template-columns: 1fr;
    }
    
    .modal-content {
        padding: 20px;
    }
}
</style>
