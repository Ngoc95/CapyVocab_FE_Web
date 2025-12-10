import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse } from '../utils/api';

export interface ExerciseFolder {
  id: number;
  code: string;
  name: string;
  price: number;
  isPublic: boolean;
  createdBy: { id: number; email: string; username: string; avatar?: string };
  flashCards?: any[];
  createdAt: string;
  voteCount: number;
  commentCount: number;
  isAlreadyVote: boolean;
  totalAttemptCount: number;
}

export interface Quiz {
  id: number;
  title: string;
  question: Question[];
}

export interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];
  explanation?: string;
  image?: string;
  time?: number;
  type: string;
}

export interface CommentItem {
  id: number;
  content: string;
  userId: number;
  username: string;
  userAvatar?: string;
  createdAt: string;
  parentId?: number | null;
  childComments?: CommentItem[];
}

export interface CreateFolderRequest {
  name: string;
  isPublic: boolean;
  price: number;
}

export interface QuizBodyData {
  title: string;
  question: any;
}

export interface FlashCardBody {
  frontContent: string;
  frontImage: string;
  backContent: string;
  backImage: string;
}

export interface UpdateFolderBodyReq {
  name?: string;
  quizzes?: QuizBodyData[];
  flashCards?: FlashCardBody[];
  price?: number;
  isPublic?: boolean;
}

export interface FolderListResponse {
  folders: ExerciseFolder[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export const exerciseService = {
  getFolders: (params?: { page?: number; limit?: number; name?: string; code?: string }): Promise<ApiResponse<FolderListResponse>> => {
    return apiGet<FolderListResponse>('/exercise', params);
  },
  getFolderById: (id: number): Promise<ApiResponse<ExerciseFolder>> => {
    return apiGet<ExerciseFolder>(`/exercise/${id}`);
  },
  createFolder: (data: CreateFolderRequest): Promise<ApiResponse<ExerciseFolder>> => {
    return apiPost<ExerciseFolder>('/exercise/new-folder', data);
  },
  updateFolder: (id: number, data: UpdateFolderBodyReq): Promise<ApiResponse<ExerciseFolder>> => {
    return apiPatch<ExerciseFolder>(`/exercise/${id}`, data);
  },
  deleteFolder: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/exercise/${id}`);
  },
  likeFolder: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPost<{ affected: number }>(`/exercise/${id}/like`);
  },
  unlikeFolder: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/exercise/${id}/unlike`);
  },
  addComment: (id: number, data: { content: string; parentId?: number }): Promise<ApiResponse<CommentItem>> => {
    const payload = data.parentId ? { content: data.content, parentId: data.parentId } : { content: data.content };
    return apiPost<CommentItem>(`/exercise/${id}/comment`, payload);
  },
  getChildComments: (id: number, parentId: number): Promise<ApiResponse<CommentItem[]>> => {
    return apiGet<CommentItem[]>(`/exercise/${id}/child-comment/${parentId}`);
  },
  finishQuiz: (id: number, quizId: number): Promise<ApiResponse<{}>> => {
    return apiPatch<{}>(`/exercise/${id}/quiz/${quizId}/finish`);
  },
};
