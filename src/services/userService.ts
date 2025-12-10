import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse } from '../utils/api';

// Types matching API response structure
export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  status: 'NOT_VERIFIED' | 'VERIFIED';
  streak: number;
  lastStudyDate: string;
  totalStudyDay: number;
  balance: number;
  role: Role;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface UserSummaryResponse {
  total: number;
  newUsers7Days: Array<{ date: string; count: number }>;
  newUsers30Days: Array<{ date: string; count: number }>;
  activeUsers7Days: Array<{ date: string; count: number }>;
  activeUsers30Days: Array<{ date: string; count: number }>;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  roleId: number;
  avatar?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  avatar?: string;
  status?: 'NOT_VERIFIED' | 'VERIFIED';
  roleId?: number;
  oldPassword?: string;
  newPassword?: string;
}

export interface UserListParams {
  page?: number;
  limit?: number;
  email?: string;
  username?: string;
  roleName?: string;
  status?: 'NOT_VERIFIED' | 'VERIFIED';
  sort?: string;
}

// User Service
export const userService = {
  // Get list of users with pagination and filters
  getUsers: (params?: UserListParams): Promise<ApiResponse<UserListResponse>> => {
    return apiGet<UserListResponse>('/users', params);
  },

  // Get user by ID
  getUserById: (id: number): Promise<ApiResponse<User>> => {
    return apiGet<User>(`/users/${id}`);
  },

  // Search user by email
  searchUserByEmail: (email: string): Promise<ApiResponse<User>> => {
    return apiGet<User>('/users/search', { email });
  },

  // Create new user
  createUser: (data: CreateUserRequest): Promise<ApiResponse<User>> => {
    return apiPost<User>('/users', data);
  },

  // Update user
  updateUser: (id: number, data: UpdateUserRequest): Promise<ApiResponse<User>> => {
    return apiPatch<User>(`/users/${id}`, data);
  },

  // Delete user (soft delete)
  deleteUser: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/users/${id}`);
  },

  // Restore user
  restoreUser: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPatch<{ affected: number }>(`/users/${id}/restore`);
  },

  // Get user statistics summary
  getUserSummary: (): Promise<ApiResponse<UserSummaryResponse>> => {
    return apiGet<UserSummaryResponse>('/users/summary');
  },
};

