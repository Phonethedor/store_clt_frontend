<template>
    <div class="cart-overlay" :class="{ 'active': cartStore.isOpen }" @click="cartStore.closeCart"></div>

    <aside class="cart-drawer" :class="{ 'active': cartStore.isOpen }">
        <div class="cart-header">
            <h2>Tu Carrito</h2>
            <button class="close-btn" @click="cartStore.closeCart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div v-if="cartStore.items.length === 0" class="empty-cart">
            <p>Tu carrito está vacío</p>
            <button class="btn-primary" @click="cartStore.closeCart">Empezar a comprar</button>
        </div>

        <div v-else class="cart-content">
            <div class="cart-items">
                <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
                    <div class="item-image">
                        <img :src="`http://localhost:3021/public/${item.image_url}`" :alt="item.name">
                    </div>
                    <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <span class="item-price">${{ formatPrice(item.price) }}</span>
                        <div class="item-actions">
                            <div class="quantity-control">
                                <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)">-</button>
                                <span>{{ item.quantity }}</span>
                                <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)">+</button>
                            </div>
                            <button class="remove-btn" @click="cartStore.removeItem(item.id)">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="summary-line">
                        <span>Subtotal</span>
                        <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                    </div>
                    <div class="summary-line total">
                        <span>Total</span>
                        <span>${{ formatPrice(cartStore.totalPrice) }}</span>
                    </div>
                </div>
                <button class="checkout-btn">Finalizar Compra</button>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const formatPrice = (value) => {
    if (!value) return "0";
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>

<style scoped>
.cart-drawer {
    position: fixed;
    top: 0;
    right: -400px;
    width: 100%;
    max-width: 400px;
    height: 100vh;
    background: var(--white);
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);
    z-index: 2000;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    display: flex;
    flex-direction: column;
}

.cart-drawer.active {
    transform: translateX(-400px);
}

.cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2px);
    opacity: 0;
    pointer-events: none;
    z-index: 1999;
    transition: opacity 0.4s ease;
}

.cart-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

.cart-header {
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
}

.cart-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 20px 30px;
}

.cart-item {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color);
}

.item-image {
    width: 80px;
    height: 100px;
    border-radius: 4px;
    overflow: hidden;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-details h4 {
    font-size: 1rem;
    margin-bottom: 4px;
}

.item-price {
    font-size: 0.9rem;
    color: var(--text-muted);
}

.item-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}

.quantity-control {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid var(--border-color);
    padding: 4px 12px;
    border-radius: 20px;
}

.remove-btn {
    font-size: 0.75rem;
    text-decoration: underline;
    opacity: 0.7;
}

.cart-footer {
    padding: 30px;
    background: var(--sand);
}

.summary-line {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
}

.summary-line.total {
    font-weight: 600;
    font-size: 1.2rem;
    border-top: 1px solid var(--border-color);
    padding-top: 12px;
    margin-top: 12px;
}

.checkout-btn {
    background: var(--charcoal);
    color: var(--white);
    width: 100%;
    padding: 16px;
    border-radius: 4px;
    font-size: 0.9rem;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 20px;
}

.empty-cart {
    padding: 60px 40px;
    text-align: center;
}
</style>
