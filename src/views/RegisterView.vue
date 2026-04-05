<template>
    <div class="auth-page auth-page--register">
        <div class="auth-page__card auth-card-view">
            <h2 class="auth-card-view__title">Crea tu cuenta</h2>
            <p class="auth-card-view__subtitle">Únete a "My peace" y gestiona tus pedidos</p>

            <form @submit.prevent="handleRegister" class="auth-card-view__form auth-form-view">
                <BaseInput 
                    label="Nombre Completo" 
                    v-model="form.full_name" 
                    required 
                    placeholder="Juan Pérez" 
                />

                <BaseInput 
                    label="Email" 
                    v-model="form.email" 
                    type="email" 
                    required 
                    placeholder="ejemplo@correo.com" 
                />

                <BaseInput 
                    label="Contraseña" 
                    v-model="form.password" 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                />

                <p v-if="authStore.error" class="auth-form-view__error-msg">
                    {{ authStore.error }}
                </p>

                <div class="auth-form-view__actions">
                    <BaseButton 
                        type="submit" 
                        variant="primary" 
                        size="full" 
                        :loading="authStore.loading"
                    >
                        Registrarse
                    </BaseButton>
                </div>
            </form>

            <p class="auth-card-view__footer">
                ¿Ya tienes cuenta? <router-link to="/login" class="auth-card-view__link">Inicia sesión</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import BaseInput from '../components/BaseInput.vue';
import BaseButton from '../components/BaseButton.vue';

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
            alert('Cuenta creada con éxito. Ahora puedes iniciar sesión.');
            router.push('/login');
        }
    } catch (err) { /* handled in store */ }
};
</script>

<style lang="scss" src="../assets/styles/views/_auth.scss" scoped></style>
