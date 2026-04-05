<template>
    <div class="cart-page">
        <header class="cart-page__hero hero-cart-view container animate-fade-in">
            <h1 class="hero-cart-view__title">Tu Carrito</h1>
            <div class="hero-cart-view__breadcrumb breadcrumb-cart">
                <router-link to="/" class="breadcrumb-cart__link">Tienda</router-link>
                <span class="breadcrumb-cart__separator">/</span>
                <span class="breadcrumb-cart__current">Carrito</span>
            </div>
        </header>

        <main class="cart-page__container container" v-if="cartStore.items.length > 0">
            <div class="cart-page__main animate-fade-up">
                <div class="cart-table-full">
                    <div class="cart-table-full__header">
                        <span class="cart-table-full__col">Producto</span>
                        <span class="cart-table-full__col">Precio</span>
                        <span class="cart-table-full__col">Cantidad</span>
                        <span class="cart-table-full__col">Subtotal</span>
                        <span class="cart-table-full__col"></span>
                    </div>

                    <div class="cart-table-full__items">
                        <TransitionGroup name="list">
                            <div v-for="item in cartStore.items" :key="item.id"
                                class="cart-table-full__row item-row-full">
                                <div class="item-row-full__product">
                                    <div class="item-row-full__image-wrapper">
                                        <img :src="`http://localhost:3021/public/${item.image_url}`" :alt="item.name"
                                            class="item-row-full__img">
                                    </div>
                                    <div class="item-row-full__info">
                                        <h3 class="item-row-full__name">{{ item.name }}</h3>
                                        <p class="item-row-full__sku">SKU: {{ item.id.toString().padStart(5, '0') }}</p>
                                    </div>
                                </div>

                                <div class="item-row-full__price">
                                    ${{ formatPrice(item.price) }}
                                </div>

                                <div class="item-row-full__quantity">
                                    <QuantityStepper :model-value="item.quantity"
                                        @update:model-value="(val) => cartStore.updateQuantity(item.id, val)"
                                        :max="item.stock || 99" size="md" />
                                </div>

                                <div class="item-row-full__subtotal">
                                    ${{ formatPrice(item.price * item.quantity) }}
                                </div>

                                <div class="item-row-full__actions">
                                    <button @click="cartStore.removeItem(item.id)" class="item-row-full__remove-btn"
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

                <div class="cart-page__actions-bottom">
                    <BaseButton variant="text" @click="router.push('/')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Seguir Comprando
                    </BaseButton>
                    <BaseButton variant="text" @click="clearCart">
                        Vaciar Carrito
                    </BaseButton>
                </div>
            </div>

            <aside class="cart-page__sidebar animate-fade-up">
                <div class="summary-card-full">
                    <h2 class="summary-card-full__title">Resumen del pedido</h2>
                    <div class="summary-card-full__lines">
                        <div class="summary-card-full__line">
                            <span>Subtotal</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                        <div class="summary-card-full__line">
                            <span>Envío estimado</span>
                            <span class="summary-card-full__free">Gratis</span>
                        </div>
                        <div class="summary-card-full__divider"></div>
                        <div class="summary-card-full__line summary-card-full__line--total">
                            <span>Total</span>
                            <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                        </div>
                    </div>

                    <div class="coupon-block-cart">
                        <label class="coupon-block-cart__label">¿Tienes un cupón?</label>
                        <div class="coupon-block-cart__input-group">
                            <input type="text" v-model="coupon" placeholder="Código de descuento"
                                class="coupon-block-cart__field" :disabled="isApplying">
                            <BaseButton @click="applyCoupon" :loading="isApplying" variant="primary" size="sm">
                                Aplicar
                            </BaseButton>
                        </div>
                    </div>

                    <BaseButton variant="primary" size="full" @click="handleCheckout" :loading="isCheckingOut">
                        <span>Proceder al pago</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </BaseButton>

                    <div class="payment-methods-cart">
                        <p class="payment-methods-cart__text">Pagos seguros aceptados</p>
                        <div class="payment-methods-cart__icons">
                            <div class="payment-methods-cart__card">VISA</div>
                            <div class="payment-methods-cart__card">MC</div>
                            <div class="payment-methods-cart__card">PayPal</div>
                        </div>
                    </div>
                </div>
            </aside>
        </main>

        <div v-else class="cart-page__empty empty-state-cart container animate-fade-in">
            <div class="empty-state-cart__icon-wrapper shadow-pulse">
                <svg class="empty-state-cart__icon" width="60" height="60" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1">
                    <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" />
                    <path d="M3 6H21M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10" />
                </svg>
            </div>
            <h2 class="empty-state-cart__title">Tu carrito está tranquilo</h2>
            <p class="empty-state-cart__text">Todavía no has encontrado tu paz. Explora nuestra colección de aromas y
                velas.</p>
            <BaseButton variant="primary" @click="router.push('/')">Ver Productos</BaseButton>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import QuantityStepper from '../components/QuantityStepper.vue';
import BaseButton from '../components/BaseButton.vue';
import { formatPrice } from '../utils/format';

const router = useRouter();
const cartStore = useCartStore();
const coupon = ref('');
const isApplying = ref(false);
const isCheckingOut = ref(false);

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
    setTimeout(() => {
        isCheckingOut.value = false;
        router.push('/checkout');
    }, 1000);
};
</script>

<style lang="scss" src="../assets/styles/views/_cart.scss" scoped></style>
