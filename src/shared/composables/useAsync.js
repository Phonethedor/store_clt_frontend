import { ref } from 'vue';

export function useAsync(asyncFunction, initialData = null) {
    const data = ref(initialData);
    const isLoading = ref(false);
    const error = ref(null);

    const execute = async (...args) => {
        isLoading.value = true;
        error.value = null;
        try {
            data.value = await asyncFunction(...args);
        } catch (err) {
            error.value = err.response?.data?.message || err.message;
        } finally {
            isLoading.value = false;
        }
    };

    return { data, isLoading, error, execute };
}
