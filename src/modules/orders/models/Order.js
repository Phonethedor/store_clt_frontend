export class Order {
    constructor(data = {}) {
        this.id = data.id || null;
        this.totalPrice = Number(data.total_price) || 0;
        this.status = data.status || 'pending';
        this.createdAt = data.created_at ? new Date(data.created_at) : null;
        this.fullName = data.full_name || '';
        this.address = data.address || '';
        this.city = data.city || '';
        this.region = data.region || '';
        this.paymentMethod = data.payment_method || '';

        this.items = (data.order_items || []).map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            name: item.product?.name || 'Producto',
            imageUrl: item.product?.image_url || ''
        }));
    }

    get statusLabel() {
        const statuses = {
            'pending': 'Pendiente',
            'paid': 'Pagado',
            'shipped': 'Enviado',
            'canceled': 'Cancelado'
        };
        return statuses[this.status] || this.status;
    }
}
