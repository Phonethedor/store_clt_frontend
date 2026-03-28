<template>
    <div class="auth-page">
        <div class="auth-card">
            <h2>Crea tu cuenta</h2>
            <p class="subtitle">Únete a "My peace" y gestiona tus pedidos</p>

            <form @submit.prevent="handleRegister" class="auth-form">
                <div class="form-group">
                    <label>Nombre Completo</label>
                    <input v-model="form.full_name" type="text" required placeholder="Juan Pérez">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input v-model="form.email" type="email" required placeholder="ejemplo@correo.com">
                </div>

                <div class="form-group">
                    <label>Contraseña</label>
                    <input v-model="form.password" type="password" required placeholder="••••••••">
                </div>

                <p v-if="authStore.error" class="error-msg">{{ authStore.error }}</p>

                <button type="submit" class="btn-primary" :disabled="authStore.loading">
                    {{ authStore.loading ? 'Creando cuenta...' : 'Registrarse' }}
                </button>
            </form>

            <p class="auth-footer">
                ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
    full_name: '',
    email: '',
    password: ''
});

const handleRegister = async () => {
    try {
        const success = await authStore.register(form);
        if (success) {
            // Opcional: Podrías loguearlo automáticamente o mandarlo al login
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            router.push('/login');
        }
    } catch (err) {
        // Errores ya se manejan en el store
    }
};
</script>

<style scoped>
.auth-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding-top: 100px;
    padding-bottom: 40px;
}

.auth-card {
    background: var(--card-bg);
    padding: 40px;
    border-radius: 8px;
    box-shadow: var(--shadow-soft);
    width: 100%;
    max-width: 450px;
    text-align: center;
}

.subtitle {
    color: var(--text-muted);
    margin-bottom: 30px;
}

.auth-form {
    text-align: left;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-main);
    border-radius: 4px;
}

.btn-primary {
    width: 100%;
    margin-top: 10px;
}

.error-msg {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-bottom: 15px;
}

.auth-footer {
    margin-top: 25px;
    font-size: 0.9rem;
    color: var(--text-muted);
}

.auth-footer a {
    color: var(--charcoal);
    text-decoration: underline;
}
</style>
