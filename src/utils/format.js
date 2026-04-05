/**
 * Utilidades de formateo para toda la aplicación
 */
export const formatPrice = (value) => {
    if (!value && value !== 0) return "0";
    // Redondea y añade separadores de miles
    return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
