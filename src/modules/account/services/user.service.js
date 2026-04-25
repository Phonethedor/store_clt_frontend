import tiendaApi from '../../../api/client';
import { User } from '../models/User';

const userService = {
    async update(userId, userData) {
        const response = await tiendaApi.patch(`/users/${userId}`, userData);
        return new User(response.data.data);
    }
};

export default userService;
