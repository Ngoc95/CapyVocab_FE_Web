import { create } from 'zustand';

export interface AdminWord {
  id: string;
  topicId: string;
  word: string;
  phonetic: string;
  translation: string;
  partOfSpeech: string;
  example: string;
  exampleTranslation: string;
  level: 1 | 2 | 3 | 4;
  image?: string;
  audioUrl?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  balance: number; // Số dư (VNĐ)
  lastStudyDate: string; // Ngày học cuối cùng
  role: 'admin' | 'user'; // Vai trò
  createdAt: string;
}

export interface AdminTopic {
  id: string;
  courseId: string;
  name: string;
  description: string;
  wordIds: string[];
  thumbnail?: string;
}

export interface AdminCourse {
  id: string;
  name: string;
  description: string;
  level: string;
  topicIds: string[];
  price: number;
  thumbnail?: string;
  status: 'Published' | 'Draft';
}

interface AdminStore {
  courses: AdminCourse[];
  topics: AdminTopic[];
  words: AdminWord[];
  users: AdminUser[];

  // Course operations
  addCourse: (course: Omit<AdminCourse, 'id' | 'topicIds'>) => string;
  updateCourse: (id: string, course: Partial<AdminCourse>) => void;
  deleteCourse: (id: string) => void;

  // Topic operations
  addTopic: (topic: Omit<AdminTopic, 'id' | 'wordIds'>) => string;
  updateTopic: (id: string, topic: Partial<AdminTopic>) => void;
  deleteTopic: (id: string) => void;
  removeTopicFromCourse: (topicId: string, courseId: string) => void;
  addTopicToCourse: (topicId: string, courseId: string) => void;

  // Word operations
  addWord: (word: Omit<AdminWord, 'id'>) => string;
  updateWord: (id: string, word: Partial<AdminWord>) => void;
  deleteWord: (id: string) => void;
  removeWordFromTopic: (wordId: string, topicId: string) => void;
  addWordToTopic: (wordId: string, topicId: string) => void;

  // User operations
  addUser: (user: Omit<AdminUser, 'id'>) => string;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;

  // Getters
  getCourseById: (id: string) => AdminCourse | undefined;
  getTopicById: (id: string) => AdminTopic | undefined;
  getWordById: (id: string) => AdminWord | undefined;
  getUserById: (id: string) => AdminUser | undefined;
  getTopicsByCourse: (courseId: string) => AdminTopic[];
  getWordsByTopic: (topicId: string) => AdminWord[];
}

// Initial data - now managed via API
const initialCourses: AdminCourse[] = [];
const initialTopics: AdminTopic[] = [];
const initialWords: AdminWord[] = [];

// Users are now managed via API, no initial mock data
const initialUsers: AdminUser[] = [];

export const useAdminStore = create<AdminStore>((set, get) => ({
  courses: initialCourses,
  topics: initialTopics,
  words: initialWords,
  users: initialUsers,

  // Course operations
  addCourse: (course) => {
    const id = `c${Date.now()}`;
    const newCourse: AdminCourse = {
      ...course,
      id,
      topicIds: [],
    };
    set((state) => ({ courses: [...state.courses, newCourse] }));
    return id;
  },

  updateCourse: (id, course) => {
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...course } : c)),
    }));
  },

  deleteCourse: (id) => {
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
      topics: state.topics.map((t) =>
        t.courseId === id ? { ...t, courseId: '' } : t
      ),
    }));
  },

  // Topic operations
  addTopic: (topic) => {
    const id = `t${Date.now()}`;
    const newTopic: AdminTopic = {
      ...topic,
      id,
      wordIds: [],
    };
    set((state) => ({
      topics: [...state.topics, newTopic],
      courses: state.courses.map((c) =>
        c.id === topic.courseId
          ? { ...c, topicIds: [...c.topicIds, id] }
          : c
      ),
    }));
    return id;
  },

  updateTopic: (id, topic) => {
    set((state) => ({
      topics: state.topics.map((t) => (t.id === id ? { ...t, ...topic } : t)),
    }));
  },

  deleteTopic: (id) => {
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== id),
      courses: state.courses.map((c) => ({
        ...c,
        topicIds: c.topicIds.filter((tId) => tId !== id),
      })),
      words: state.words.map((w) =>
        w.topicId === id ? { ...w, topicId: '' } : w
      ),
    }));
  },

  removeTopicFromCourse: (topicId, courseId) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId
          ? { ...c, topicIds: c.topicIds.filter((id) => id !== topicId) }
          : c
      ),
      topics: state.topics.map((t) =>
        t.id === topicId ? { ...t, courseId: '' } : t
      ),
    }));
  },

  addTopicToCourse: (topicId, courseId) => {
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === courseId && !c.topicIds.includes(topicId)
          ? { ...c, topicIds: [...c.topicIds, topicId] }
          : c
      ),
      topics: state.topics.map((t) =>
        t.id === topicId ? { ...t, courseId } : t
      ),
    }));
  },

  // Word operations
  addWord: (word) => {
    const id = `w${Date.now()}`;
    const newWord: AdminWord = {
      ...word,
      id,
    };
    set((state) => ({
      words: [...state.words, newWord],
      topics: state.topics.map((t) =>
        t.id === word.topicId
          ? { ...t, wordIds: [...t.wordIds, id] }
          : t
      ),
    }));
    return id;
  },

  updateWord: (id, word) => {
    set((state) => ({
      words: state.words.map((w) => (w.id === id ? { ...w, ...word } : w)),
    }));
  },

  deleteWord: (id) => {
    set((state) => ({
      words: state.words.filter((w) => w.id !== id),
      topics: state.topics.map((t) => ({
        ...t,
        wordIds: t.wordIds.filter((wId) => wId !== id),
      })),
    }));
  },

  removeWordFromTopic: (wordId, topicId) => {
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId
          ? { ...t, wordIds: t.wordIds.filter((id) => id !== wordId) }
          : t
      ),
      words: state.words.map((w) =>
        w.id === wordId ? { ...w, topicId: '' } : w
      ),
    }));
  },

  addWordToTopic: (wordId, topicId) => {
    set((state) => ({
      topics: state.topics.map((t) =>
        t.id === topicId && !t.wordIds.includes(wordId)
          ? { ...t, wordIds: [...t.wordIds, wordId] }
          : t
      ),
      words: state.words.map((w) =>
        w.id === wordId ? { ...w, topicId } : w
      ),
    }));
  },

  // User operations
  addUser: (user) => {
    const id = `u${Date.now()}`;
    const newUser: AdminUser = {
      ...user,
      id,
    };
    set((state) => ({ users: [...state.users, newUser] }));
    return id;
  },

  updateUser: (id, user) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)),
    }));
  },

  deleteUser: (id) => {
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },

  // Getters
  getCourseById: (id) => get().courses.find((c) => c.id === id),
  getTopicById: (id) => get().topics.find((t) => t.id === id),
  getWordById: (id) => get().words.find((w) => w.id === id),
  getUserById: (id) => get().users.find((u) => u.id === id),

  getTopicsByCourse: (courseId) => {
    const course = get().courses.find((c) => c.id === courseId);
    if (!course) return [];
    return get().topics.filter((t) => course.topicIds.includes(t.id));
  },

  getWordsByTopic: (topicId) => {
    const topic = get().topics.find((t) => t.id === topicId);
    if (!topic) return [];
    return get().words.filter((w) => topic.wordIds.includes(w.id));
  },
}));