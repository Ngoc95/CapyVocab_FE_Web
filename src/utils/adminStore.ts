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

// Initial data
const initialCourses: AdminCourse[] = [
  {
    id: '1',
    name: 'IELTS Foundation',
    description: 'Khóa học IELTS cơ bản cho người mới bắt đầu',
    level: 'Beginner',
    topicIds: ['1', '2'],
    price: 0,
    status: 'Published',
    thumbnail: '📚',
  },
  {
    id: '2',
    name: 'Business English',
    description: 'Tiếng Anh giao tiếp trong môi trường công sở',
    level: 'Intermediate',
    topicIds: ['3'],
    price: 0,
    status: 'Published',
    thumbnail: '💼',
  },
  {
    id: '3',
    name: 'Daily Conversation',
    description: 'Giao tiếp hàng ngày trong cuộc sống',
    level: 'Beginner',
    topicIds: ['4', '5'],
    price: 0,
    status: 'Published',
    thumbnail: '🗣️',
  },
];

const initialTopics: AdminTopic[] = [
  {
    id: '1',
    courseId: '1',
    name: 'Greetings & Introductions',
    description: 'Chào hỏi và giới thiệu bản thân',
    wordIds: ['1', '2', '3'],
    thumbnail: '👋',
  },
  {
    id: '2',
    courseId: '1',
    name: 'Food & Dining',
    description: 'Từ vựng về ăn uống',
    wordIds: ['4', '5'],
    thumbnail: '🍽️',
  },
  {
    id: '3',
    courseId: '2',
    name: 'Business Meetings',
    description: 'Họp hành trong công việc',
    wordIds: ['6'],
    thumbnail: '💼',
  },
  {
    id: '4',
    courseId: '3',
    name: 'Shopping',
    description: 'Mua sắm và thanh toán',
    wordIds: ['7', '8'],
    thumbnail: '🛍️',
  },
  {
    id: '5',
    courseId: '3',
    name: 'Transportation',
    description: 'Phương tiện di chuyển',
    wordIds: [],
    thumbnail: '🚗',
  },
];

const initialWords: AdminWord[] = [
  {
    id: '1',
    topicId: '1',
    word: 'Hello',
    phonetic: '/həˈloʊ/',
    translation: 'Xin chào',
    partOfSpeech: 'interjection',
    example: 'Hello! How are you?',
    exampleTranslation: 'Xin chào! Bạn khỏe không?',
    level: 1,
    image: 'https://images.unsplash.com/photo-1502764613149-7f1d229e230f?w=400&h=400&fit=crop',
    audioUrl: 'https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3',
  },
  {
    id: '2',
    topicId: '1',
    word: 'Goodbye',
    phonetic: '/ˌɡʊdˈbaɪ/',
    translation: 'Tạm biệt',
    partOfSpeech: 'interjection',
    example: 'Goodbye! See you later.',
    exampleTranslation: 'Tạm biệt! Hẹn gặp lại.',
    level: 1,
    image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    topicId: '1',
    word: 'Please',
    phonetic: '/pliːz/',
    translation: 'Làm ơn',
    partOfSpeech: 'adverb',
    example: 'Please help me.',
    exampleTranslation: 'Làm ơn giúp tôi.',
    level: 1,
  },
  {
    id: '4',
    topicId: '2',
    word: 'Restaurant',
    phonetic: '/ˈrestərɑːnt/',
    translation: 'Nhà hàng',
    partOfSpeech: 'noun',
    example: 'Let\'s go to a restaurant.',
    exampleTranslation: 'Hãy đi đến nhà hàng.',
    level: 2,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    topicId: '2',
    word: 'Delicious',
    phonetic: '/dɪˈlɪʃəs/',
    translation: 'Ngon',
    partOfSpeech: 'adjective',
    example: 'This food is delicious!',
    exampleTranslation: 'Món ăn này ngon!',
    level: 2,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    topicId: '3',
    word: 'Meeting',
    phonetic: '/ˈmiːtɪŋ/',
    translation: 'Cuộc họp',
    partOfSpeech: 'noun',
    example: 'We have a meeting at 2 PM.',
    exampleTranslation: 'Chúng ta có cuộc họp lúc 2 giờ chiều.',
    level: 3,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    topicId: '4',
    word: 'Shopping',
    phonetic: '/ˈʃɑːpɪŋ/',
    translation: 'Mua sắm',
    partOfSpeech: 'noun',
    example: 'I love shopping on weekends.',
    exampleTranslation: 'Tôi thích mua sắm vào cuối tuần.',
    level: 1,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    topicId: '4',
    word: 'Price',
    phonetic: '/praɪs/',
    translation: 'Giá cả',
    partOfSpeech: 'noun',
    example: 'What is the price?',
    exampleTranslation: 'Giá bao nhiêu?',
    level: 1,
  },
];

const initialUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Admin001',
    email: 'admin001@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    streak: 5,
    balance: 0,
    lastStudyDate: new Date('2024-12-01').toISOString(),
    role: 'admin',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'User001',
    email: 'user001@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    streak: 3,
    balance: 150000,
    lastStudyDate: new Date('2024-12-02').toISOString(),
    role: 'user',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'Elsa Wyman',
    email: 'elsa.wyman@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    streak: 12,
    balance: 250000,
    lastStudyDate: new Date('2024-12-03').toISOString(),
    role: 'user',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: '4',
    name: 'Andre Rutz',
    email: 'andre.rutz@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    streak: 8,
    balance: 80000,
    lastStudyDate: new Date('2024-11-30').toISOString(),
    role: 'user',
    createdAt: new Date('2024-05-05').toISOString(),
  },
];

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