export class Product {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || 'Producto sin nombre';
        this.price = Number(data.price) || 0;
        this.description = data.description || '';
        this.imageUrl = data.image_url || 'placeholder.jpg';
        this.stock = data.stock || 0;
        this.category = data.categorie?.name || 'Varios';
    }

    get hasStock() {
        return this.stock > 0;
    }

    get formattedPrice() {
        return `$${this.price.toLocaleString('es-CL')}`;
    }
}
