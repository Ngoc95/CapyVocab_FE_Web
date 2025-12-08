import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse } from '../utils/api';

// Types matching API response structure
export type TopicType = 'Free' | 'Premium';

export interface Topic {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  type: TopicType;
  words?: Array<{
    id: number;
    content: string;
    pronunciation?: string;
    meaning?: string;
    position?: string;
  }>;
  courses?: Array<{
    id: number;
    title: string;
  }>;
  alreadyLearned?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface TopicListResponse {
  topics: Topic[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface TopicWordsResponse {
  words: Array<{
    id: number;
    content: string;
    pronunciation: string;
    meaning: string;
    position: string;
    audio?: string;
    image?: string;
    example?: string;
    translateExample?: string;
  }>;
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface TopicSummaryResponse {
  totalTopics: number;
  progressStats: {
    completed: number;
    notCompleted: number;
  };
  popularTopic: Array<{
    topic: number;
    completeCount: number;
  }>;
}

export interface CreateTopicRequest {
  title: string;
  description: string;
  thumbnail?: string;
  type?: TopicType;
  wordIds?: number[];
  courseIds?: number[];
}

export interface UpdateTopicRequest {
  title?: string;
  description?: string;
  thumbnail?: string;
  type?: TopicType;
  wordIds?: number[];
}

export interface TopicListParams {
  page?: number;
  limit?: number;
  title?: string;
  description?: string;
  type?: TopicType;
  sort?: string;
}

export interface TopicWordsParams {
  page?: number;
  limit?: number;
  content?: string;
  sort?: string;
}

// Topic Service
export const topicService = {
  // Get list of topics with pagination and filters
  getTopics: (params?: TopicListParams): Promise<ApiResponse<TopicListResponse>> => {
    return apiGet<TopicListResponse>('/topics', params);
  },

  // Get topic by ID
  getTopicById: (id: number): Promise<ApiResponse<Topic>> => {
    return apiGet<Topic>(`/topics/${id}`);
  },

  // Get words of a topic
  getTopicWords: (id: number, params?: TopicWordsParams): Promise<ApiResponse<TopicWordsResponse>> => {
    return apiGet<TopicWordsResponse>(`/topics/${id}/words`, params);
  },

  // Get topic types
  getTopicTypes: (): Promise<ApiResponse<{ data: TopicType[] }>> => {
    return apiGet<{ data: TopicType[] }>('/topics/type-list');
  },

  // Create new topic(s)
  createTopics: (topics: CreateTopicRequest[]): Promise<ApiResponse<Topic[]>> => {
    return apiPost<Topic[]>('/topics', { topics });
  },

  // Update topic
  updateTopic: (id: number, data: UpdateTopicRequest): Promise<ApiResponse<Topic>> => {
    return apiPatch<Topic>(`/topics/${id}`, {
      ...data,
      wordIds: data.wordIds ?? []
    });
  },

  // Delete topic (soft delete)
  deleteTopic: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/topics/${id}`);
  },

  // Restore topic
  restoreTopic: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPatch<{ affected: number }>(`/topics/${id}/restore`);
  },

  // Get topic statistics summary
  getTopicSummary: (): Promise<ApiResponse<TopicSummaryResponse>> => {
    return apiGet<TopicSummaryResponse>('/topics/summary');
  },
};

