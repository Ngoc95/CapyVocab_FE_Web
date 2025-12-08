import { apiGet, apiPost, apiPut, ApiResponse } from '../utils/api';

// Types matching API response structure
export interface Role {
  id: number;
  name: string;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  status: 'NOT_VERIFIED' | 'VERIFIED';
  streak?: number;
  lastStudyDate?: string;
  totalStudyDay?: number;
  role: Role;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface SendChangePasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  newPassword: string;
}

export interface GoogleOAuthRequest {
  idToken: string;
}

// Auth Service
export const authService = {
  // Register new user
  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiPost<AuthResponse>('/auth/register', data);
  },

  // Login
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiPost<AuthResponse>('/auth/login', data);
  },

  // Refresh token
  refreshToken: (data: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
    return apiPost<RefreshTokenResponse>('/auth/refresh', data);
  },

  // Logout
  logout: (data: LogoutRequest): Promise<ApiResponse<{ affected: number }>> => {
    return apiPost<{ affected: number }>('/auth/logout', data);
  },

  // Get account info
  getAccount: (): Promise<ApiResponse<{ user: AuthUser }>> => {
    return apiGet<{ user: AuthUser }>('/auth/account');
  },

  // Update profile
  updateProfile: (data: UpdateProfileRequest): Promise<ApiResponse<{}>> => {
    return apiPut<{}>('/auth/profile', data);
  },

  // Send verification email
  sendVerificationEmail: (): Promise<ApiResponse<{}>> => {
    return apiPost<{}>('/email/send-verification');
  },

  // Verify email
  verifyEmail: (data: VerifyEmailRequest): Promise<ApiResponse<{ user: AuthUser }>> => {
    return apiPost<{ user: AuthUser }>('/auth/verify-email', data);
  },

  // Send change password email
  sendChangePasswordEmail: (data: SendChangePasswordRequest): Promise<ApiResponse<{}>> => {
    return apiPost<{}>('/email/change-password', data);
  },

  // Change password
  changePassword: (code: string, data: ChangePasswordRequest): Promise<ApiResponse<{}>> => {
    return apiPut<{}>(`/auth/change-password?code=${code}`, data);
  },

  // Google OAuth login
  googleLogin: (data: GoogleOAuthRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiPost<AuthResponse>('/oauth/google', data);
  },
};
