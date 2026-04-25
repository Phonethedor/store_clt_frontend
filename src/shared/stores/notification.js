import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: []
    }),
    actions: {
        // Tipos: 'success', 'error', 'warning', 'info'
        add(message, type = 'info', duration = 5000) {
            const id = Date.now();
            this.notifications.push({ id, message, type });

            setTimeout(() => {
                this.remove(id);
            }, duration);
        },
        remove(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        }
    }
});
