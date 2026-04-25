import tiendaApi from '../../../api/client';
import { Order } from '../models/Order';

const orderService = {
    async create(orderData) {
        const response = await tiendaApi.post('/orders', orderData);
        return response.data;
    },
    async getByUserId(userId, page = 1, limit = 10) {
        const response = await tiendaApi.get(`/orders/user/${userId}`, {
            params: { page, limit }
        });
        const { orders, totalPages, currentPage } = response.data.data;
        return {
            orders: orders.map(o => new Order(o)),
            totalPages,
            currentPage
        };
    }
};

export default orderService;
