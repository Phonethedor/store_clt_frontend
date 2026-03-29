<template>
    <div class="toast-container">
        <TransitionGroup name="toast">
            <div v-for="n in notificationStore.notifications" :key="n.id" :class="['toast-item', n.type]">
                <div class="toast-icon">
                    <svg v-if="n.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <!-- Otros iconos aquí si deseas -->
                </div>
                <div class="toast-message">{{ n.message }}</div>
                <button @click="notificationStore.remove(n.id)" class="close-toast">&times;</button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script setup>
import { useNotificationStore } from '../stores/notification';
const notificationStore = useNotificationStore();
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast-item {
    pointer-events: auto;
    min-width: 300px;
    max-width: 450px;
    padding: 16px 20px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 4px solid var(--primary-color);
}

.toast-item.error {
    border-left-color: #e74c3c;
    color: #1a1a1a;
}

.toast-item.success {
    border-left-color: #2ecc71;
}

.toast-message {
    font-size: 0.9rem;
    font-weight: 500;
    flex: 1;
}

.close-toast {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.5;
}

/* Transiciones */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.4s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateX(30px) scale(0.9);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
