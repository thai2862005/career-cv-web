import axios from './axios.customize';

export const notificationService = {
  // Get notifications
  getNotifications: async (params = {}) => {
    return axios.get('/notifications', { params });
  },

  // Mark as read
  markAsRead: async (id) => {
    return axios.put(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: async () => {
    return axios.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: async (id) => {
    return axios.delete(`/notifications/${id}`);
  },
};
