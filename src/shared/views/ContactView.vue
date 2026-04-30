<script setup>
import { reactive, ref } from 'vue';
import { useNotificationStore } from '../stores/notification';

const notificationStore = useNotificationStore();
const isSubmitting = ref(false);

const form = reactive({
    name: '',
    email: '',
    subject: '',
    message: ''
});

const handleSubmit = async () => {
    isSubmitting.value = true;

    try {
        // Endpoint real de Formspree
        const response = await fetch('https://formspree.io/f/mqeyzlad', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            notificationStore.add('Mensaje enviado con éxito. Te contactaremos pronto.', 'success');
            // Reset form
            form.name = '';
            form.email = '';
            form.subject = '';
            form.message = '';
        } else {
            notificationStore.add('Hubo un error al enviar. Intenta nuevamente.', 'error');
        }
    } catch (error) {
        notificationStore.add('Error de conexión. Revisa tu internet.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style lang="scss" src="../../assets/styles/views/_contact.scss" scoped></style>

<template>
    <div class="contact-page animate-fade-in">
        <div class="container contact-container">
            <div class="contact-info">
                <span class="subtitle">Contacto</span>
                <h1>Estamos para escucharte</h1>
                <p>¿Tienes alguna duda sobre tu pedido o quieres enviarnos tus comentarios? Selecciona el motivo y nos
                    pondremos en contacto contigo lo antes posible.</p>

                <div class="contact-methods">
                    <div class="method">
                        <span class="label">Email</span>
                        <span class="val">contacto@mypeace.cl</span>
                    </div>
                    <div class="method">
                        <span class="label">Horario</span>
                        <span class="val">Lunes a Viernes: 09:00 - 18:00</span>
                    </div>
                </div>
            </div>

            <div class="contact-form-card glassmorphism">
                <form @submit.prevent="handleSubmit" id="contact-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" name="name" v-model="form.name" required placeholder="Tu nombre">
                        </div>
                        <div class="form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" name="email" v-model="form.email" required
                                placeholder="email@ejemplo.com">
                        </div>
                        <div class="form-group span-2">
                            <label>Motivo del Contacto</label>
                            <select name="subject" v-model="form.subject" required>
                                <option value="" disabled>Selecciona un motivo</option>
                                <option value="Venta">Venta y Productos</option>
                                <option value="Devolución">Devolución / Garantía</option>
                                <option value="Sugerencia">Sugerencia</option>
                                <option value="Reclamo">Reclamo</option>
                                <option value="Otros">Otros</option>
                            </select>
                        </div>
                        <div class="form-group span-2">
                            <label>Mensaje</label>
                            <textarea name="message" v-model="form.message" rows="5" required
                                placeholder="Escribe tu mensaje aquí..."></textarea>
                        </div>
                    </div>

                    <!-- Captcha Placeholder / Mensaje de Formspree -->
                    <p class="captcha-note">Este formulario está protegido por la seguridad contra spam de Formspree.
                    </p>

                    <button type="submit" class="btn-primary" :disabled="isSubmitting">
                        <span v-if="!isSubmitting">Enviar Mensaje</span>
                        <span v-else>Enviando...</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
