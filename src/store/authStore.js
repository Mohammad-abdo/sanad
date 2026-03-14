import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: (admin, token) => {
        set({
          admin,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateAdmin: (admin) => {
        set({ admin });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

