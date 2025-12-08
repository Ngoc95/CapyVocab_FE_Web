import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse } from '../utils/api';

// Types matching API response structure
export type WordPosition = 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Others';

export interface Word {
  id: number;
  content: string;
  pronunciation: string;
  meaning: string;
  position: WordPosition;
  audio?: string;
  image?: string;
  example?: string;
  translateExample?: string;
  topics?: Array<{
    id: number;
    title: string;
  }>;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface WordListResponse {
  words: Word[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CreateWordRequest {
  content: string;
  pronunciation: string;
  meaning: string;
  position?: WordPosition;
  audio?: string;
  image?: string;
  example?: string;
  translateExample?: string;
  topicIds?: number[];
}

export interface UpdateWordRequest {
  content?: string;
  pronunciation?: string;
  meaning?: string;
  position?: WordPosition;
  audio?: string;
  image?: string;
  example?: string;
  translateExample?: string;
  topicIds?: number[];
}

export interface WordListParams {
  page?: number;
  limit?: number;
  content?: string;
  pronunciation?: string;
  meaning?: string;
  position?: WordPosition;
  example?: string;
  translateExample?: string;
  sort?: string;
}

// Word Service
export const wordService = {
  // Get list of words with pagination and filters
  getWords: (params?: WordListParams): Promise<ApiResponse<WordListResponse>> => {
    return apiGet<WordListResponse>('/words', params);
  },

  // Get word by ID
  getWordById: (id: number): Promise<ApiResponse<Word>> => {
    return apiGet<Word>(`/words/${id}`);
  },

  // Get word positions
  getWordPositions: (): Promise<ApiResponse<{ data: WordPosition[] }>> => {
    return apiGet<{ data: WordPosition[] }>('/words/position-list');
  },

  // Create new word(s)
  createWords: (words: CreateWordRequest[]): Promise<ApiResponse<Word[]>> => {
    return apiPost<Word[]>('/words', { words });
  },

  // Update word
  updateWord: (id: number, data: UpdateWordRequest): Promise<ApiResponse<Word>> => {
    return apiPatch<Word>(`/words/${id}`, data);
  },

  // Delete word (soft delete)
  deleteWord: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/words/${id}`);
  },

  // Restore word
  restoreWord: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPatch<{ affected: number }>(`/words/${id}/restore`);
  },
};

