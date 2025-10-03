import { api } from './api';

export const tasksService = {
    async getTasks(search, status) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const response = await api.get(`/tasks?${params.toString()}`);
        return response.data;
    },

    async getTask(id) {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    async createTask(taskData) {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },

    async updateTask(id, taskData) {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response.data;
    },

    async deleteTask(id) {
        await api.delete(`/tasks/${id}`);
    },
};