<script setup>
import { useNotificationStore } from '../stores/notification';
const notificationStore = useNotificationStore();
</script>

<style lang="scss" src="../../assets/styles/components/_toast.scss" scoped></style>

<template>
    <div class="toast-container">
        <TransitionGroup name="toast">
            <div v-for="n in notificationStore.notifications" :key="n.id" class="toast-container__item toast-item"
                :class="[`toast-item--${n.type}`]">
                <div class="toast-item__icon">
                    <svg v-if="n.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                </div>
                <div class="toast-item__message">{{ n.message }}</div>
                <button @click="notificationStore.remove(n.id)" class="toast-item__close">&times;</button>
            </div>
        </TransitionGroup>
    </div>
</template>