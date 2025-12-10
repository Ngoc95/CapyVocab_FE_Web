import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, AuthUser } from '../services/authService';
import { toast } from 'sonner';

export type UserRole = 'ADMIN' | 'USER';

interface User {
  id: number;
  email: string;
  username: string;
  name?: string; // For display, can use username
  role: UserRole;
  avatar?: string;
  status?: 'NOT_VERIFIED' | 'VERIFIED';
  streak?: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  viewAsUser: boolean; // For admin to view as user
  login: (username: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateProfile: (data: { username?: string; email?: string; avatar?: string }) => Promise<boolean>;
  toggleViewAsUser: () => void;
}

// Helper to convert API user to store user
const convertUser = (apiUser: AuthUser): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    username: apiUser.username,
    name: apiUser.username, // Use username as display name
    role: apiUser.role.name as UserRole,
    avatar: apiUser.avatar,
    status: apiUser.status,
    streak: apiUser.streak,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      viewAsUser: false,

      login: async (username: string, password: string) => {
        try {
          const response = await authService.login({ username, password });
          const { user, accessToken, refreshToken } = response.metaData;
          
          set({
            user: convertUser(user),
            accessToken,
            refreshToken,
            isAuthenticated: true,
            viewAsUser: false,
          });
          console.log('Login successful:', user);
          return true;
        } catch (error: any) {
          console.error('Login error:', error);
          toast.error(error.message || 'Đăng nhập thất bại');
          return false;
        }
      },

      register: async (email: string, username: string, password: string) => {
        try {
          const response = await authService.register({ email, username, password });
          const { user, accessToken, refreshToken } = response.metaData;

          set({
            user: convertUser(user),
            accessToken,
            refreshToken,
            isAuthenticated: true,
            viewAsUser: false,
          });

          return true;
        } catch (error: any) {
          console.error('Register error:', error);
          toast.error(error.message || 'Đăng ký thất bại');
          return false;
        }
      },

      logout: async () => {
        try {
          const { refreshToken } = get();
          if (refreshToken) {
            await authService.logout({ refreshToken });
          }
        } catch (error) {
          console.error('Logout error:', error);
          // Continue with logout even if API call fails
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            viewAsUser: false,
          });
        }
      },

      refreshAuth: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const response = await authService.refreshToken({ refreshToken });
          const { accessToken, refreshToken: newRefreshToken } = response.metaData;

          set({
            accessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error('Refresh auth error:', error);
          // Clear auth on refresh failure
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            viewAsUser: false,
          });
          throw error;
        }
      },

      updateProfile: async (data: { username?: string; email?: string; avatar?: string }) => {
        try {
          await authService.updateProfile(data);
          
          // Update user in store
          const { user } = get();
          if (user) {
            set({
              user: {
                ...user,
                ...(data.username && { username: data.username }),
                ...(data.email && { email: data.email }),
                ...(data.avatar !== undefined && { avatar: data.avatar }),
              },
            });
          }

          return true;
        } catch (error: any) {
          console.error('Update profile error:', error);
          toast.error(error.message || 'Cập nhật profile thất bại');
          return false;
        }
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
