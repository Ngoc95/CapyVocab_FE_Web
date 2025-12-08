import { apiGet, apiPost, apiPatch, apiDelete, ApiResponse } from '../utils/api';

// Types matching API response structure
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advance';

export interface CourseTopic {
  id: number;
  topic: {
    id: number;
    title?: string;
  };
  displayOrder?: number;
}

export interface Course {
  id: number;
  title: string;
  level: CourseLevel;
  target?: string;
  description?: string;
  totalTopic?: number;
  courseTopics?: CourseTopic[];
  topics?: Array<{
    id: number;
    title: string;
    description?: string;
    displayOrder: number;
  }>;
  alreadyLearned?: boolean;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CourseListResponse {
  courses: Course[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface CourseSummaryResponse {
  totalCourses: number;
  courseCountByLevel: Array<{
    level: CourseLevel;
    count: number;
  }>;
  progressStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  topCourses: {
    topCourses: Array<{
      courseId: number;
      learnerCount: number;
    }>;
  };
}

export interface CreateCourseRequest {
  title: string;
  level: CourseLevel;
  target?: string;
  description?: string;
  topics?: Array<{
    id: number;
    displayOrder: number;
  }> ;
}

export interface UpdateCourseRequest {
  title?: string;
  level?: CourseLevel;
  target?: string;
  description?: string;
  topics?: Array<{
    id: number;
    displayOrder: number;
  }>;
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  title?: string;
  target?: string;
  level?: CourseLevel;
  description?: string;
  sort?: string;
}

export interface CourseTopicsParams {
  page?: number;
  limit?: number;
  title?: string;
  sort?: string;
}

// Course Service
export const courseService = {
  // Get list of courses with pagination and filters
  getCourses: (params?: CourseListParams): Promise<ApiResponse<CourseListResponse>> => {
    return apiGet<CourseListResponse>('/courses', params);
  },

  // Get course by ID
  getCourseById: (id: number): Promise<ApiResponse<Course>> => {
    return apiGet<Course>(`/courses/${id}`);
  },

  // Get topics of a course
  getCourseTopics: (id: number, params?: CourseTopicsParams): Promise<ApiResponse<any>> => {
    return apiGet<any>(`/courses/${id}/topics`, params);
  },

  // Get course levels
  getCourseLevels: (): Promise<ApiResponse<{ data: CourseLevel[] }>> => {
    return apiGet<{ data: CourseLevel[] }>('/courses/level-list');
  },

  // Create new course(s)
  createCourses: (courses: CreateCourseRequest[]): Promise<ApiResponse<Course[]>> => {
    const coursesWithDefaults = courses.map(course => ({
      ...course,
      topics: course.topics ?? []
    }));
    return apiPost<Course[]>('/courses', { courses: coursesWithDefaults });
  },

  // Update course
  updateCourse: (id: number, data: UpdateCourseRequest): Promise<ApiResponse<Course>> => {
    return apiPatch<Course>(`/courses/${id}`, {
      ...data,
      topics: data.topics ?? []
    });
  },

  // Delete course (soft delete)
  deleteCourse: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiDelete<{ affected: number }>(`/courses/${id}`);
  },

  // Restore course
  restoreCourse: (id: number): Promise<ApiResponse<{ affected: number }>> => {
    return apiPatch<{ affected: number }>(`/courses/${id}/restore`);
  },

  // Get course statistics summary
  getCourseSummary: (): Promise<ApiResponse<CourseSummaryResponse>> => {
    return apiGet<CourseSummaryResponse>('/courses/summary');
  },
};

