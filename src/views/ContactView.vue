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

<style scoped>
.contact-page {
    padding-top: 140px;
    padding-bottom: 100px;
    min-height: 90vh;
}

.contact-container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 80px;
    align-items: center;
}

.subtitle {
    display: block;
    text-transform: uppercase;
    letter-spacing: 4px;
    font-size: 0.8rem;
    color: var(--taupe);
    margin-bottom: 15px;
}

.contact-info h1 {
    font-family: var(--font-serif);
    font-size: 3rem;
    margin-bottom: 25px;
}

.contact-info p {
    color: var(--text-muted);
    line-height: 1.8;
    margin-bottom: 40px;
}

.contact-methods {
    display: grid;
    gap: 30px;
}

.method .label {
    display: block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--taupe);
    margin-bottom: 5px;
}

.method .val {
    font-size: 1.1rem;
    font-weight: 500;
}

.contact-form-card {
    padding: 50px;
    border-radius: 24px;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
}

.span-2 {
    grid-column: span 2;
}

.form-group label {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 10px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 15px;
    background: rgba(0, 0, 0, 0.03);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-color);
    outline: none;
    transition: all 0.3s;
}

[data-theme='dark'] .form-group input,
[data-theme='dark'] .form-group select,
[data-theme='dark'] .form-group textarea {
    background: rgba(255, 255, 255, 0.05);
}

[data-theme='dark'] .form-group select option {
    background: #1a1a1a;
    color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--primary-color);
    background: rgba(255, 255, 255, 0.1);
}

.captcha-note {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin: 20px 0;
}

.btn-primary {
    width: 100%;
    padding: 18px;
    font-size: 1rem;
}

@media (max-width: 968px) {
    .contact-container {
        grid-template-columns: 1fr;
        gap: 60px;
    }

    .contact-form-card {
        padding: 30px;
    }
}
</style>
