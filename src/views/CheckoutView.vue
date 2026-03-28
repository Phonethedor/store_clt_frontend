<template>
    <div class="checkout-page animate-fade-in">
        <header class="checkout-header container">
            <button @click="router.back()" class="back-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver al Carrito
            </button>
            <h1>Finalizar Pedido</h1>
        </header>

        <main class="checkout-container container">
            <!-- Sección Izquierda: Formulario -->
            <section class="checkout-forms">
                <div class="form-step active">
                    <div class="step-header">
                        <span class="step-num">1</span>
                        <h2>Datos de Envío</h2>
                    </div>

                    <div class="step-content grid-forms">
                        <div class="form-group span-2">
                            <label>Nombre Completo</label>
                            <input type="text" v-model="form.name" placeholder="Ej. Juan Pérez">
                        </div>
                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" v-model="form.address" placeholder="Nombre de calle y número">
                        </div>
                        <div class="form-group">
                            <label>Ciudad</label>
                            <input type="text" v-model="form.city" placeholder="Ej. Santiago">
                        </div>
                        <div class="form-group">
                            <label>Región / Provincia</label>
                            <input type="text" v-model="form.region" placeholder="Ej. Región Metropolitana">
                        </div>
                    </div>
                </div>

                <div class="form-step">
                    <div class="step-header">
                        <span class="step-num">2</span>
                        <h2>Método de Pago</h2>
                    </div>
                    <div class="step-content">
                        <div class="payment-options">
                            <label class="payment-card" :class="{ selected: form.payment === 'card' }">
                                <input type="radio" value="card" v-model="form.payment">
                                <div class="card-info">
                                    <span class="card-title">Tarjeta de Crédito / Débito</span>
                                    <p>Webpay Plus, Visa, Mastercard</p>
                                </div>
                            </label>

                            <label class="payment-card" :class="{ selected: form.payment === 'transfer' }">
                                <input type="radio" value="transfer" v-model="form.payment">
                                <div class="card-info">
                                    <span class="card-title">Transferencia Bancaria</span>
                                    <p>Recibe los datos al finalizar el pedido</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Sección Derecha: Resumen -->
            <aside class="order-summary">
                <div class="summary-card sticky-summary">
                    <h3>Resumen del Pedido</h3>

                    <div class="order-items-minimal">
                        <div v-for="item in cartStore.items" :key="item.id" class="minimal-item">
                            <div class="item-img-mini">
                                <img :src="`http://localhost:3021/public/${item.image_url}`" :alt="item.name">
                                <span class="qty-badge">{{ item.quantity }}</span>
                            </div>
                            <div class="item-info-mini">
                                <span class="name">{{ item.name }}</span>
                                <span class="price">${{ formatPrice(item.price * item.quantity) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-lines">
                        <div class="line">
                            <span>Subtotal</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                        <div class="line">
                            <span>Costo de Envío</span>
                            <span class="free">Gratis</span>
                        </div>
                        <div class="line divider-thin"></div>
                        <div class="line total-lg">
                            <span>Total</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                    </div>

                    <button class="btn-primary place-order-btn" @click="handlePlaceOrder" :disabled="isProcessing">
                        <span v-if="!isProcessing">Confirmar y Pagar</span>
                        <span v-else class="loader-inline">Procesando...</span>
                    </button>

                    <p class="safe-note">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Pago 100% Seguro y encriptado
                    </p>
                </div>
            </aside>
        </main>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import tiendaApi from '../api/tiendaApi';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const isProcessing = ref(false);

const form = reactive({
    name: authStore.user?.full_name || '',
    address: '',
    city: '',
    region: '',
    payment: 'card'
});

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handlePlaceOrder = async () => {
    if (!form.name || !form.address || !form.city || !form.region) {
        alert('Por favor, completa los campos obligatorios.');
        return;
    }

    if (!authStore.isAuthenticated) {
        alert('Debes iniciar sesión para realizar un pedido.');
        router.push('/login');
        return;
    }

    isProcessing.value = true;
    try {
        const orderData = {
            user_id: authStore.user.id,
            total_price: cartStore.totalPrice,
            full_name: form.name,
            address: form.address,
            city: form.city,
            region: form.region,
            payment_method: form.payment,
            items: cartStore.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        await tiendaApi.post('/orders', orderData);

        alert('¡Pedido realizado con éxito! Gracias por tu compra.');
        cartStore.clearCart();
        router.push('/');
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        alert(error.response?.data?.message || 'Error al procesar el pedido. Intenta nuevamente.');
    } finally {
        isProcessing.value = false;
    }
}
</script>

<style scoped>
.checkout-page {
    padding-top: 140px;
    min-height: 100vh;
    padding-bottom: 100px;
    background-color: var(--sand);
}

.checkout-header {
    margin-bottom: 40px;
}

.back-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 20px;
}

.checkout-container {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 40px;
    align-items: flex-start;
}

.form-step {
    background: var(--white);
    padding: 40px;
    border-radius: 8px;
    box-shadow: var(--shadow-soft);
    margin-bottom: 25px;
}

.step-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--sand);
}

.step-num {
    width: 32px;
    height: 32px;
    background: var(--charcoal);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.85rem;
}

.grid-forms {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}

.span-2 {
    grid-column: span 2;
}

.form-group label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 8px;
    color: var(--text-muted);
}

.form-group input {
    width: 100%;
    padding: 12px;
    background: var(--sand);
    border: 1px solid var(--border-color);
    border-radius: 4px;
}

/* Payment Cards */
.payment-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.payment-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.payment-card:hover {
    background: var(--sand);
}

.payment-card.selected {
    border-color: var(--charcoal);
    background: rgba(56, 44, 36, 0.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-title {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
}

.card-info p {
    font-size: 0.85rem;
    color: var(--text-muted);
}

/* Summary Box */
.sticky-summary {
    position: sticky;
    top: 140px;
    background: var(--card-bg);
    padding: 40px;
    border-radius: 8px;
    box-shadow: var(--shadow-hover);
}

.minimal-item {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-bottom: 15px;
}

.item-img-mini {
    position: relative;
    width: 50px;
    height: 60px;
    border-radius: 4px;
    overflow: visible;
}

.item-img-mini img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.qty-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    background: var(--charcoal);
    color: var(--white);
    border-radius: 50%;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-info-mini {
    flex: 1;
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
}

.divider-thin {
    height: 1px;
    background: var(--border-color);
    margin: 15px 0;
}

.total-lg {
    font-size: 1.5rem;
    font-weight: 600;
}

.place-order-btn {
    width: 100%;
    padding: 20px;
    margin-top: 30px;
    font-size: 1rem;
}

.safe-note {
    margin-top: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 0.75rem;
    color: var(--text-muted);
}

[data-theme='dark'] .form-step,
[data-theme='dark'] .sticky-summary {
    background: var(--white);
}

[data-theme='dark'] .form-group input {
    background: var(--gray-100);
    color: var(--text-main);
    border-color: rgba(255, 255, 255, 0.1);
}

[data-theme='dark'] .form-group input::placeholder {
    color: var(--text-muted);
    opacity: 0.6;
}

@media (max-width: 1000px) {
    .checkout-container {
        grid-template-columns: 1fr;
    }
}
</style>
