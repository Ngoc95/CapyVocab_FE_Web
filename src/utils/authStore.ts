import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  viewAsUser: boolean; // For admin to view as user
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleViewAsUser: () => void;
}

// Mock users for demo
const mockUsers: Record<string, { password: string; user: User }> = {
  'admin@capyvocab.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@capyvocab.com',
      name: 'Admin User',
      role: 'admin',
    },
  },
  'user@capyvocab.com': {
    password: 'user123',
    user: {
      id: '2',
      email: 'user@capyvocab.com',
      name: 'John Doe',
      role: 'user',
    },
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      viewAsUser: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const account = mockUsers[email];
        if (account && account.password === password) {
          set({
            user: account.user,
            isAuthenticated: true,
            viewAsUser: false,
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          viewAsUser: false,
        });
      },

      toggleViewAsUser: () => {
        set((state) => ({
          viewAsUser: !state.viewAsUser,
        }));
      },
    }),
    {
      name: 'capy-vocab-auth',
    }
  )
);
