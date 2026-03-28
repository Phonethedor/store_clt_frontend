<template>
    <div class="cart-page">
        <header class="cart-hero container animate-slide-up">
            <h1>Tu Carrito</h1>
            <div class="bread-crumb">
                <router-link to="/">Tienda</router-link> / <span>Carrito</span>
            </div>
        </header>

        <main class="cart-container container" v-if="cartStore.items.length > 0">
            <div class="cart-main animate-slide-up">
                <div class="cart-table">
                    <div class="table-header">
                        <span class="col-product">Producto</span>
                        <span class="col-price">Precio</span>
                        <span class="col-qty">Cantidad</span>
                        <span class="col-total">Subtotal</span>
                        <span class="col-actions"></span>
                    </div>

                    <div class="cart-items">
                        <TransitionGroup name="list">
                            <div v-for="item in cartStore.items" :key="item.id" class="cart-item-row">
                                <div class="product-info col-product">
                                    <div class="item-img">
                                        <img :src="`http://localhost:3021/public/${item.image_url}`" :alt="item.name">
                                    </div>
                                    <div class="item-text">
                                        <h3>{{ item.name }}</h3>
                                        <p class="sku">SKU: {{ item.id.toString().padStart(5, '0') }}</p>
                                    </div>
                                </div>

                                <div class="price col-price">
                                    ${{ formatPrice(item.price) }}
                                </div>

                                <div class="quantity col-qty">
                                    <div class="qty-stepper">
                                        <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                                            :disabled="item.quantity <= 1">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M5 12h14" />
                                            </svg>
                                        </button>
                                        <input type="number" :value="item.quantity" readonly>
                                        <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                stroke="currentColor" stroke-width="2">
                                                <path d="M12 5v14M5 12h14" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div class="subtotal col-total">
                                    ${{ formatPrice(item.price * item.quantity) }}
                                </div>

                                <div class="actions col-actions">
                                    <button @click="cartStore.removeItem(item.id)" class="remove-btn"
                                        title="Eliminar ítem">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.5">
                                            <path
                                                d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>
                </div>

                <div class="cart-actions-bottom">
                    <router-link to="/" class="btn-text">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Seguir Comprando
                    </router-link>
                    <button class="btn-text" @click="clearCart">
                        Vaciar Carrito
                    </button>
                </div>
            </div>

            <aside class="cart-sidebar animate-slide-up">
                <div class="summary-card">
                    <h2>Resumen del pedido</h2>
                    <div class="summary-lines">
                        <div class="line">
                            <span>Subtotal</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                        <div class="line">
                            <span>Envío estimado</span>
                            <span class="free">Gratis</span>
                        </div>
                        <div class="line divider"></div>
                        <div class="line total">
                            <span>Total</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                    </div>

                    <div class="coupon-section">
                        <label>¿Tienes un cupón?</label>
                        <div class="coupon-input">
                            <input type="text" v-model="coupon" placeholder="Código de descuento"
                                :disabled="isApplying">
                            <button class="btn-apply" @click="applyCoupon" :disabled="isApplying">
                                {{ isApplying ? '...' : 'Aplicar' }}
                            </button>
                        </div>
                    </div>

                    <button class="btn-primary checkout-btn-full" @click="handleCheckout" :disabled="isCheckingOut">
                        <span>{{ isCheckingOut ? 'Cargando seguro...' : 'Proceder al pago' }}</span>
                        <svg v-if="!isCheckingOut" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div class="payment-methods">
                        <p>Pagos seguros aceptados</p>
                        <div class="methods-icons">
                            <div class="p-card">VISA</div>
                            <div class="p-card">MC</div>
                            <div class="p-card">PayPal</div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>

        <div v-else class="empty-state container animate-fade-in">
            <div class="empty-icon shadow-pulse">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" />
                    <path d="M3 6H21M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" />
                </svg>
            </div>
            <h2>Tu carrito está tranquilo</h2>
            <p>Todavía no has encontrado tu paz. Explora nuestra colección de aromas y velas.</p>
            <router-link to="/" class="btn-primary">Ver Productos</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
const coupon = ref('');
const isApplying = ref(false);
const isCheckingOut = ref(false);

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const clearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        cartStore.clearCart();
    }
};

const applyCoupon = () => {
    if (!coupon.value) return;
    isApplying.value = true;
    setTimeout(() => {
        isApplying.value = false;
        alert('Este cupón no es válido en este momento.');
        coupon.value = '';
    }, 1500);
};

const handleCheckout = () => {
    isCheckingOut.value = true;
    // Simulación de navegación a checkout
    setTimeout(() => {
        isCheckingOut.value = false;
        alert('Enviándote a la pasarela de pago segura...');
    }, 2000);
};
</script>

<style scoped>
.cart-page {
    padding-top: 140px;
    min-height: 100vh;
    padding-bottom: 120px;
    background-image: radial-gradient(circle at 0% 0%, var(--sand) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, var(--taupe) 0%, transparent 50%);
}

.cart-hero {
    margin-bottom: 60px;
    text-align: left;
}

.cart-hero h1 {
    font-size: 3.5rem;
    margin-bottom: 15px;
    letter-spacing: -1px;
}

.bread-crumb {
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-muted);
}

.cart-container {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 80px;
    align-items: flex-start;
}

.cart-main {
    background: var(--card-bg);
    border-radius: 8px;
    padding: 20px;
    box-shadow: var(--shadow-soft);
}

.table-header {
    display: grid;
    grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
    padding: 20px 0;
    border-bottom: 2px solid var(--sand);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
    color: var(--text-muted);
}

.cart-item-row {
    display: grid;
    grid-template-columns: 3fr 1fr 1.5fr 1fr 0.5fr;
    align-items: center;
    padding: 30px 0;
    border-bottom: 1px solid var(--sand);
    transition: var(--transition-smooth);
}

.cart-item-row:hover {
    background: var(--sand);
    transform: scale(1.005);
    border-radius: 4px;
}

.product-info {
    display: flex;
    gap: 25px;
    align-items: center;
    padding: 0 10px;
}

.item-img {
    width: 90px;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;
    background: var(--sand);
}

.item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

[data-theme='dark'] .item-img img {
    mix-blend-mode: normal;
    filter: brightness(1.1);
}

.item-text h3 {
    font-size: 1.15rem;
    font-family: var(--font-serif);
    margin-bottom: 5px;
}

.sku {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-family: var(--font-sans);
}

.price,
.subtotal {
    font-weight: 500;
}

.qty-stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sand);
    height: 40px;
    border-radius: 4px;
    width: fit-content;
}

.qty-stepper button {
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--charcoal);
}

.qty-stepper button:disabled {
    opacity: 0.3;
}

.qty-stepper input {
    width: 40px;
    text-align: center;
    border: none;
    background: transparent;
    color: var(--charcoal);
    font-weight: 600;
}

.remove-btn {
    color: var(--text-muted);
    opacity: 0.5;
    transition: all 0.3s;
}

.remove-btn:hover {
    color: #e63946;
    opacity: 1;
    transform: rotate(90deg);
}

.cart-actions-bottom {
    display: flex;
    justify-content: space-between;
    padding: 40px 10px 10px;
}

.btn-text {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--charcoal);
    font-weight: 500;
}

.btn-text:hover {
    opacity: 0.6;
}

/* Sidebar */
.summary-card {
    background: var(--card-bg);
    padding: 40px;
    border-radius: 8px;
    box-shadow: var(--shadow-soft);
}

.summary-card h2 {
    font-size: 1.8rem;
    margin-bottom: 35px;
}

.summary-lines .line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
    font-size: 1rem;
}

.summary-lines .free {
    color: var(--sage);
    font-weight: 600;
}

.line.divider {
    height: 1px;
    background: var(--sand);
    margin: 25px 0;
}

.line.total {
    font-weight: 600;
    font-size: 1.4rem;
}

.coupon-section {
    margin: 35px 0;
}

.coupon-section label {
    display: block;
    margin-bottom: 15px;
    font-size: 0.85rem;
    color: var(--text-muted);
}

.coupon-input {
    display: flex;
    gap: 10px;
}

.coupon-input input {
    flex: 1;
    background: var(--sand);
    border: 1px solid var(--border-color);
    padding: 12px;
    border-radius: 4px;
    font-size: 0.9rem;
}

.btn-apply {
    background: var(--taupe);
    color: var(--charcoal);
    padding: 0 20px;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
}

.checkout-btn-full {
    width: 100%;
    padding: 20px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.payment-methods {
    margin-top: 40px;
    text-align: center;
}

.payment-methods p {
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-bottom: 15px;
}

.methods-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.p-card {
    font-size: 0.7rem;
    padding: 5px 10px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    color: var(--text-muted);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 120px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon {
    margin-bottom: 40px;
    color: var(--taupe);
    padding: 30px;
    background: var(--white);
    border-radius: 50%;
}

.shadow-pulse {
    box-shadow: 0 0 0 0 rgba(234, 221, 207, 0.4);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(234, 221, 207, 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 20px rgba(234, 221, 207, 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(234, 221, 207, 0);
    }
}

/* Animations for list */
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

@media (max-width: 1100px) {
    .cart-container {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .table-header {
        display: none;
    }

    .cart-item-row {
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .col-product {
        grid-column: span 2;
    }
}
</style>
