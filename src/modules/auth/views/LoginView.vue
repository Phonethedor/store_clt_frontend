<script setup>
import { reactive } from 'vue';
import { useAuthStore } from '../store/auth.store';
import { useRouter } from 'vue-router';
import BaseInput from '../../../shared/components/BaseInput.vue';
import BaseButton from '../../../shared/components/BaseButton.vue';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });

const handleLogin = async () => {
    try {
        await authStore.login(form);
        router.push('/');
    } catch (err) { /* handled in store */ }
};
</script>

<style lang="scss" src="../../../assets/styles/views/_auth.scss" scoped></style>

<template>
    <div class="auth-page">
        <div class="auth-page__card auth-card-view">
            <h2 class="auth-card-view__title">Bienvenido</h2>
            <p class="auth-card-view__subtitle">Ingresa a tu cuenta para continuar</p>

            <form @submit.prevent="handleLogin" class="auth-card-view__form auth-form-view">
                <BaseInput label="Email" v-model="form.email" type="email" required placeholder="ejemplo@correo.com" />
                <BaseInput label="Contraseña" v-model="form.password" type="password" required placeholder="••••••••" />

                <p v-if="authStore.error" class="auth-form-view__error-msg">
                    {{ authStore.error }}
                </p>

                <div class="auth-form-view__actions">
                    <BaseButton type="submit" variant="primary" size="full" :loading="authStore.loading">
                        Iniciar Sesión
                    </BaseButton>
                </div>
            </form>

            <p class="auth-card-view__footer">
                ¿No tienes cuenta? <router-link to="/registro" class="auth-card-view__link">Regístrate
                    aquí</router-link>
            </p>
        </div>
    </div>
</template>