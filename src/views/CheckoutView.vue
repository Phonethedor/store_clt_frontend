<template>
    <div class="checkout-page animate-fade-in">
        <header class="checkout-page__header header-checkout container">
            <BaseButton variant="text" size="sm" @click="router.back()" class="header-checkout__back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver al Carrito
            </BaseButton>
            <h1 class="header-checkout__title">Finalizar Pedido</h1>
        </header>

        <main class="checkout-page__container container">
            <section class="checkout-page__forms">
                <!-- Step 1: Envío -->
                <div class="checkout-page__step step-checkout">
                    <div class="step-checkout__header">
                        <span class="step-checkout__number">1</span>
                        <h2 class="step-checkout__title">Datos de Envío</h2>
                    </div>

                    <div class="step-checkout__content grid-checkout">
                        <BaseInput class="grid-checkout__span-2" label="Nombre Completo" v-model="form.name"
                            placeholder="Ej. Juan Pérez" required />
                        <BaseInput label="Dirección" v-model="form.address" placeholder="Nombre de calle y número"
                            required />
                        <BaseInput label="Ciudad" v-model="form.city" placeholder="Ej. Santiago" required />
                        <BaseInput label="Región / Provincia" v-model="form.region"
                            placeholder="Ej. Región Metropolitana" required />
                    </div>
                </div>

                <!-- Step 2: Pago -->
                <div class="checkout-page__step step-checkout">
                    <div class="step-checkout__header">
                        <span class="step-checkout__number">2</span>
                        <h2 class="step-checkout__title">Método de Pago</h2>
                    </div>
                    <div class="step-checkout__content">
                        <div class="payment-options-checkout">
                            <label class="payment-options-checkout__card payment-card-checkout"
                                :class="{ 'payment-card-checkout--selected': form.payment === 'card' }">
                                <input type="radio" value="card" v-model="form.payment" style="display:none">
                                <div class="payment-card-checkout__info">
                                    <span class="payment-card-checkout__title">Tarjeta de Crédito / Débito</span>
                                    <p class="payment-card-checkout__text">Webpay Plus, Visa, Mastercard</p>
                                </div>
                            </label>

                            <label class="payment-options-checkout__card payment-card-checkout"
                                :class="{ 'payment-card-checkout--selected': form.payment === 'transfer' }">
                                <input type="radio" value="transfer" v-model="form.payment" style="display:none">
                                <div class="payment-card-checkout__info">
                                    <span class="payment-card-checkout__title">Transferencia Bancaria</span>
                                    <p class="payment-card-checkout__text">Recibe los datos al finalizar el pedido</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <aside class="checkout-page__summary">
                <div class="summary-checkout">
                    <h3 class="summary-checkout__title">Resumen del Pedido</h3>

                    <div class="summary-checkout__items">
                        <div v-for="item in cartStore.items" :key="item.id" class="mini-item-checkout">
                            <div class="mini-item-checkout__image-wrapper">
                                <img :src="`http://localhost:3021/public/${item.imageUrl}`" :alt="item.name"
                                    class="mini-item-checkout__img">
                                <span class="mini-item-checkout__badge">{{ item.quantity }}</span>
                            </div>
                            <div class="mini-item-checkout__details">
                                <span class="mini-item-checkout__name">{{ item.name }}</span>
                                <span class="mini-item-checkout__price">${{ formatPrice(item.price * item.quantity)
                                    }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-lines-checkout">
                        <div class="summary-lines-checkout__line">
                            <span>Subtotal</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                        <div class="summary-lines-checkout__line">
                            <span>Costo de Envío</span>
                            <span class="summary-lines-checkout__free">Gratis</span>
                        </div>
                        <div class="summary-lines-checkout__line summary-lines-checkout__line--total">
                            <span>Total</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                    </div>

                    <BaseButton variant="primary" size="full" :loading="isProcessing" @click="handlePlaceOrder">
                        Confirmar y Pagar
                    </BaseButton>

                    <p class="summary-checkout__safe-note">
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
import { formatPrice } from '../utils/format';
import BaseButton from '../components/BaseButton.vue';
import BaseInput from '../components/BaseInput.vue';
import orderService from '../services/orderService';
import { useNotificationStore } from '../stores/notification';

const notificationStore = useNotificationStore();
const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();
const isProcessing = ref(false);

const form = reactive({
    name: authStore.user?.fullName || '',
    address: '',
    city: '',
    region: '',
    payment: 'card'
});

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

        await orderService.create(orderData);

        alert('¡Pedido realizado con éxito! Gracias por tu compra.');
        cartStore.clearCart();
        router.push('/');
    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        const msg = error.response?.data?.message || 'Error al procesar el pedido.';
        notificationStore.add(msg, 'error');
    } finally {
        isProcessing.value = false;
    }
}
</script>

<style lang="scss" src="../assets/styles/views/_checkout.scss" scoped></style>
