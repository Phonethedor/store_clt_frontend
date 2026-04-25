import tiendaApi from '../../../api/client';
import { Product } from '../models/Product';

const productService = {
    async getAll() {
        const response = await tiendaApi.get('/products');
        return response.data.data.map(item => new Product(item));
    },
    async getByCategory(categoryId) {
        const response = await tiendaApi.get(`/products/categorie/${categoryId}`);
        return response.data.data.map(item => new Product(item));
    },
    async getCategories() {
        const response = await tiendaApi.get('/categories');
        return response.data.data;
    },
    async getCategoryById(categoryId) {
        const response = await tiendaApi.get(`/categories/${categoryId}`);
        return response.data.data;
    }
};

export default productService;
