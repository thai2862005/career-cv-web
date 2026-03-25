import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),
      
      updateUser: (userData) => set({ 
        user: { ...get().user, ...userData } 
      }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),
      
      getRole: () => {
        const user = get().user;
        if (!user) return null;
        const raw = user.roleName || user.role?.name || user.role;
        return raw ? String(raw).toUpperCase() : null;
      },

      isJobSeeker: () => {
        const role = get().getRole();
        return role === 'JOB_SEEKER' || role === 'JOB-SEEKER' || role === 'JOBSEEKER';
      },

      isHR: () => {
        const role = get().getRole();
        return role === 'HR' || role === 'H R';
      },

      isAdmin: () => {
        const role = get().getRole();
        return role === 'ADMIN' || role === 'ADMINISTRATOR';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
