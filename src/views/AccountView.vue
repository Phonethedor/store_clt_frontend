<template>
    <div class="account-page">
        <div class="account-container">
            <div class="account-header">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y preferencias</p>
            </div>

            <div class="account-card" :class="{ 'editing': isEditing }">
                <div class="card-content">
                    <!-- User Avatar Circle -->
                    <div class="avatar-section">
                        <div class="avatar-circle">
                            {{ authStore.user?.initials || 'U' }}
                        </div>
                    </div>

                    <!-- Info / Feedback messages -->
                    <div v-if="successMsg" class="success-banner">
                        {{ successMsg }}
                    </div>
                    <div v-if="authStore.error" class="error-banner">
                        {{ authStore.error }}
                    </div>

                    <form @submit.prevent="handleUpdate" class="profile-form">
                        <!-- Full Name -->
                        <div class="form-group">
                            <label>Nombre Completo</label>
                            <div v-if="!isEditing" class="read-only-box">{{ authStore.user?.fullName }}</div>
                            <input v-else v-model="form.full_name" type="text" required
                                placeholder="Tu nombre completo">
                        </div>

                        <!-- Email (read-only in this simple version, or can be made editable) -->
                        <div class="form-group">
                            <label>Correo Electrónico</label>
                            <div v-if="!isEditing" class="read-only-box">{{ authStore.user?.email }}</div>
                            <input v-else v-model="form.email" type="email" required placeholder="correo@ejemplo.com">
                        </div>

                        <div class="form-group">
                            <label>Miembro desde</label>
                            <div class="read-only-box date-box">
                                {{ formatDate(authStore.user?.createdAt) }}
                            </div>
                        </div>

                        <!-- Controls -->
                        <div class="form-actions">
                            <button v-if="!isEditing" type="button" class="btn-edit" @click="startEditing">
                                Editar Información
                            </button>

                            <template v-else>
                                <button type="submit" class="btn-save" :disabled="authStore.loading">
                                    {{ authStore.loading ? 'Guardando...' : 'Guardar Cambios' }}
                                </button>
                                <button type="button" class="btn-cancel" @click="cancelEditing">
                                    Cancelar
                                </button>
                            </template>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const isEditing = ref(false);
const successMsg = ref('');

const form = reactive({
    full_name: '',
    email: ''
});

const startEditing = () => {
    form.full_name = authStore.user.fullName;
    form.email = authStore.user.email;
    isEditing.value = true;
    successMsg.value = '';
};

const cancelEditing = () => {
    isEditing.value = false;
};

const handleUpdate = async () => {
    try {
        await authStore.updateUser({ ...form });
        isEditing.value = false;
        successMsg.value = 'Información actualizada con éxito';
        setTimeout(() => successMsg.value = '', 3000);
    } catch (err) {
        // Error handled by store
    }
};

const formatDate = (dateStr) => {
    if (!dateStr) return 'Recientemente';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<style scoped>
.account-page {
    padding: 120px 20px 60px;
    min-height: 90vh;
    display: flex;
    justify-content: center;
    background: var(--sand);
}

.account-container {
    width: 100%;
    max-width: 600px;
}

.account-header {
    text-align: center;
    margin-bottom: 40px;
}

.account-header h1 {
    font-size: 2.5rem;
    letter-spacing: 2px;
    margin-bottom: 8px;
}

.account-header p {
    color: var(--text-muted);
    font-size: 0.95rem;
}

.account-card {
    background: var(--card-bg);
    padding: 40px;
    border-radius: 12px;
    box-shadow: var(--shadow-soft);
    transition: var(--transition-smooth);
    border: 1px solid var(--border-color);
}

.account-card.editing {
    box-shadow: var(--shadow-hover);
    transform: scale(1.01);
}

.avatar-section {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
}

.avatar-circle {
    width: 80px;
    height: 80px;
    background: var(--taupe);
    color: var(--charcoal);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-family: var(--font-serif);
    border: 2px solid var(--border-color);
}

.success-banner {
    background: rgba(193, 202, 186, 0.2);
    color: #2d5a27;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.error-banner {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    margin-bottom: 20px;
    font-size: 0.9rem;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group label {
    display: block;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 8px;
}

.read-only-box {
    padding: 12px 0;
    font-size: 1.1rem;
    color: var(--text-main);
    border-bottom: 1px solid var(--border-color);
}

.date-box {
    color: var(--text-muted);
    font-size: 0.95rem;
    border-bottom: none;
}

input {
    width: 100%;
    padding: 12px;
    background: transparent;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: var(--text-main);
    font-family: var(--font-sans);
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

input:focus {
    outline: none;
    border-color: var(--charcoal);
}

.form-actions {
    margin-top: 20px;
    display: flex;
    gap: 15px;
}

.btn-edit,
.btn-save {
    background-color: var(--charcoal);
    color: var(--white);
    padding: 12px 24px;
    border-radius: 4px;
    flex: 1;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-cancel {
    border: 1px solid var(--border-color);
    color: var(--text-main);
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-edit:hover,
.btn-save:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
}

.btn-cancel:hover {
    background: var(--gray-100);
}
</style>
