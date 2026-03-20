import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
    state: () => ({
        searchQuery: ''
    }),
    actions: {
        clearSearch() {
            this.searchQuery = '';
        }
    }
});
