import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse, apiUpload } from '../utils/api';
import type { CommentItem } from './exerciseService';

export interface PostItem {
  id: number;
  content: string;
  thumbnails: string[];
  tags: string[];
  voteCount: number;
  commentCount: number;
  isAlreadyVote: boolean;
  createdAt: string;
  createdBy: { id: number; username: string; avatar?: string };
}

export interface CreatePostRequest {
  content: string;
  thumbnails: string[];
  tags: string[];
}

export interface PostListResponse {
  posts: PostItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const postService = {
  getPosts: (params?: { page?: number; limit?: number; ownerId?: number; tag?: string; content?: string }): Promise<ApiResponse<PostListResponse>> => {
    return apiGet<PostListResponse>('/posts', params);
  },
  getPostById: (id: number): Promise<ApiResponse<PostItem>> => {
    return apiGet<PostItem>(`/posts/${id}`);
  },
  createPost: (data: CreatePostRequest): Promise<ApiResponse<PostItem>> => {
    return apiPost<PostItem>('/posts', data);
  },
  updatePost: (id: number, data: Partial<CreatePostRequest>): Promise<ApiResponse<PostItem>> => {
    return apiPatch<PostItem>(`/posts/${id}`, data);
  },
  deletePost: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/posts/${id}`);
  },
  likePost: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPost<{ affected: number }>(`/posts/${id}/like`);
  },
  unlikePost: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/posts/${id}/unlike`);
  },
  createComment: (postId: number, data: { content: string; parentComment?: number | null }): Promise<ApiResponse<CommentItem>> => {
    const payload = data.parentComment ? { content: data.content, parentComment: data.parentComment } : { content: data.content };
    return apiPost<CommentItem>(`/posts/${postId}/comment`, payload);
  },
  getComments: (postId: number, params?: { parentId?: number | null }): Promise<ApiResponse<CommentItem[]>> => {
    return apiGet<CommentItem[]>(`/posts/${postId}/comment`, params);
  },
  getChildComments: (postId: number, parentId: number): Promise<ApiResponse<CommentItem[]>> => {
    return apiGet<CommentItem[]>(`/posts/${postId}/child-comment/${parentId}`);
  },
  uploadImages: async (files: File[]): Promise<string[]> => {
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    const res = await apiUpload<{ urls: string[] }>('upload/images', fd);
    return res.metaData.urls || [];
  },
};
