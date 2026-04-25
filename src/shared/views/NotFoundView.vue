<style scoped>
.not-found {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.not-found-content {
    max-width: 600px;
    z-index: 10;
}

.error-code {
    font-size: 8rem;
    font-family: var(--font-serif);
    color: var(--taupe);
    line-height: 1;
    display: block;
    margin-bottom: 20px;
    opacity: 0.5;
}

h1 {
    font-size: 3rem;
    margin-bottom: 20px;
}

.header-line {
    width: 60px;
    height: 1px;
    background-color: var(--charcoal);
    margin: 0 auto 30px;
}

p {
    font-size: 1.1rem;
    color: var(--text-muted);
    margin-bottom: 40px;
}

.actions {
    display: flex;
    gap: 16px;
    justify-content: center;
}

/* Reutilizando auras de homeView para consistencia */
.scent-aura {
    position: absolute;
    width: 500px;
    height: 500px;
    filter: blur(100px);
    border-radius: 50%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.15;
}

.aura-1 {
    top: 10%;
    left: -10%;
    background: radial-gradient(circle, var(--sage) 0%, transparent 70%);
}

.aura-2 {
    bottom: 10%;
    right: -10%;
    background: radial-gradient(circle, var(--taupe) 0%, transparent 70%);
}

@media (max-width: 600px) {
    .actions {
        flex-direction: column;
    }

    .error-code {
        font-size: 6rem;
    }

    h1 {
        font-size: 2.2rem;
    }
}
</style>

<template>
    <div class="not-found container">
        <div class="not-found-content animate-slide-up">
            <span class="error-code">404</span>
            <h1>Aroma No Encontrado</h1>
            <div class="header-line"></div>
            <p>
                Lo sentimos, la página que buscas parece haberse desvanecido en el aire.
                Tal vez el enlace sea incorrecto o el producto ya no esté disponible.
            </p>
            <div class="actions">
                <router-link to="/" class="btn-primary">Volver a la tienda</router-link>
                <router-link to="/contacto" class="btn-outline">Contactar soporte</router-link>
            </div>
        </div>

        <!-- Elementos decorativos (Scents) -->
        <div class="scent-aura aura-1"></div>
        <div class="scent-aura aura-2"></div>
    </div>
</template>