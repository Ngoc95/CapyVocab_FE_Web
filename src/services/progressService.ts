import { apiGet, apiPost, apiPut, ApiResponse } from '../utils/api';

export interface WordReviewItemDto {
  word: {
    id: number;
    content: string;
    pronunciation?: string;
    meaning?: string;
    position?: string;
    audio?: string;
    image?: string;
    example?: string;
    translateExample?: string;
  };
  masteryLevel: number;
  reviewCount: number;
  nextReviewDate: string;
}

export interface WordReviewResponse {
  words: WordReviewItemDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface WordProgressUpdate {
  wordId: number;
  wrongCount: number;
  reviewedDate: string;
}

export interface ProgressRequest {
  wordProgress: WordProgressUpdate[];
}

export interface WordProgressUpdateResponse {
  updatedCount: number;
}

export interface ProgressStatistic {
  level: string;
  wordCount: number;
}

export interface ProgressSummaryResponse {
  totalLearnWord: number;
  statistics: ProgressStatistic[];
}

export const progressService = {
  getWordReview: (): Promise<ApiResponse<WordReviewResponse>> => {
    return apiGet<WordReviewResponse>('/progress/word-review');
  },

  updateWordProgress: (
    data: ProgressRequest
  ): Promise<ApiResponse<WordProgressUpdateResponse>> => {
    return apiPut<WordProgressUpdateResponse>('/progress/word', data);
  },

  completeTopic: (
    data: { topicId: number }
  ): Promise<ApiResponse<{}>> => {
    return apiPost<{}>('/progress/complete-topic', data);
  },

  getSummary: (): Promise<ApiResponse<ProgressSummaryResponse>> => {
    return apiGet<ProgressSummaryResponse>('/progress/summary');
  },
};

