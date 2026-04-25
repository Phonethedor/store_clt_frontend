<script setup>
import { useCartStore } from '../store/cart.store';
import QuantityStepper from './QuantityStepper.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';
import { formatPrice } from '../../../shared/utils/format';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartStore = useCartStore();

const goToCart = () => {
    cartStore.closeCart();
    router.push('/carrito');
};

const goToCheckout = () => {
    cartStore.closeCart();
    router.push('/checkout');
};
</script>

<style lang="scss" src="../../../assets/styles/components/_cart-drawer.scss" scoped></style>

<template>
    <div class="cart-overlay" :class="{ 'cart-overlay--active': cartStore.isOpen }" @click="cartStore.closeCart"></div>

    <aside class="cart-drawer" :class="{ 'cart-drawer--active': cartStore.isOpen }">
        <div class="cart-drawer__header header-cart">
            <h2 class="header-cart__title">Tu Carrito</h2>
            <button class="header-cart__close-btn" @click="cartStore.closeCart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="cart-drawer__empty empty-cart">
            <p class="empty-cart__text">Tu carrito está vacío</p>
            <BaseButton variant="primary" @click="cartStore.closeCart">Empezar a comprar</BaseButton>
        </div>

        <div v-else class="cart-drawer__content content-cart">
            <div class="content-cart__items items-cart">
                <div v-for="item in cartStore.items" :key="item.id" class="items-cart__item item-cart">
                    <div class="item-cart__image">
                        <img :src="`http://localhost:3021/public/${item.imageUrl}`" :alt="item.name"
                            class="item-cart__img">
                    </div>
                    <div class="item-cart__details">
                        <h4 class="item-cart__name">{{ item.name }}</h4>
                        <span class="item-cart__price">${{ formatPrice(item.price) }}</span>
                        <div class="item-cart__actions">
                            <QuantityStepper :model-value="item.quantity"
                                @update:model-value="(val) => cartStore.updateQuantity(item.id, val)" size="sm" />
                            <BaseButton variant="text" size="sm" class="item-cart__remove-btn"
                                @click="cartStore.removeItem(item.id)">Eliminar</BaseButton>
                        </div>
                    </div>
                </div>
            </div>

            <div class="content-cart__footer footer-cart">
                <div class="footer-cart__summary summary-cart">
                    <div class="summary-cart__line">
                        <span>Subtotal: </span>
                        <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                    </div>
                    <div class="summary-cart__line summary-cart__line--total">
                        <span>Total: </span>
                        <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                    </div>
                </div>
                <div class="footer-cart__actions">
                    <BaseButton variant="outline" size="full" @click="goToCart">
                        Ver Carrito
                    </BaseButton>
                    <BaseButton variant="primary" size="full" @click="goToCheckout">
                        Finalizar Compra
                    </BaseButton>
                </div>
            </div>
        </div>
    </aside>
</template>