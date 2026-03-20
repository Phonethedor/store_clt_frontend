import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: JSON.parse(localStorage.getItem('cart') || '[]'),
        isOpen: false,
    }),

    getters: {
        totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: (state) => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    },

    actions: {
        addItem(product) {
            const existingItem = this.items.find(item => item.id === product.id);

            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                }
            } else {
                if (product.stock > 0) {
                    this.items.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image_url: product.image_url,
                        quantity: 1,
                        stock: product.stock // Keep track of limit
                    });
                }
            }
            this.saveCart();
            this.openCart(); // Open drawer when adding item
        },

        removeItem(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
        },

        updateQuantity(productId, quantity) {
            const item = this.items.find(item => item.id === productId);
            if (item) {
                item.quantity = Math.max(1, Math.min(quantity, item.stock));
                this.saveCart();
            }
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.items));
        },

        toggleCart() {
            this.isOpen = !this.isOpen;
        },

        openCart() {
            this.isOpen = true;
        },

        closeCart() {
            this.isOpen = false;
        }
    }
});
