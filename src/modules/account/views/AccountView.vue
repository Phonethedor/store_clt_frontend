<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../../auth/store/auth.store';

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

<style lang="scss" src="../../../assets/styles/views/_account.scss" scoped></style>

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