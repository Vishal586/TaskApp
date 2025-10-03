import { api } from './api';

export const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async register(username, email, password) {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async updateProfile(userData) {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    },
};