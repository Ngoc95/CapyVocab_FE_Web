// Admin-created content structures
export interface Word {
  id: string;
  term: string;
  definition: string;
  pronunciation?: string;
  example?: string;
  image?: string;
  audioUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  words: Word[];
  courseId: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  thumbnail?: string;
  topics: Topic[];
}

// User-created content structures
export interface Flashcard {
  id: string;
  term: string; // Từ vựng
  definition: string; // Định nghĩa
  frontImage?: string; // Hình ảnh mặt trước
  backImage?: string; // Hình ảnh mặt sau
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-in'; // Chọn đáp án hoặc Điền từ
  question: string; // Nội dung câu hỏi
  // For multiple-choice
  answerMode?: 'single' | 'multiple'; // Một đáp án đúng hoặc nhiều đáp án đúng
  options?: string[]; // A, B, C, D
  correctAnswers?: number[]; // Index của đáp án đúng
  // For fill-in
  correctAnswer?: string;
  explanation?: string; // Giải thích đáp án
  timeLimit?: number; // Thời gian trả lời (giây)
}

export interface Material {
  id: string;
  code: string; // Mã code để tìm kiếm
  title: string; // Tiêu đề học liệu
  description?: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  isPublic: boolean; // Công khai hay riêng tư
  price: number; // 0 = miễn phí
  thumbnail?: string;
  flashcards: Flashcard[]; // Bộ flashcard
  quizzes: QuizQuestion[]; // Bộ quiz
  likes: number;
  views: number;
  comments: Comment[];
  isPurchased?: boolean; // User đã mua chưa (nếu có phí)
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  materialId: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'rejected';
}

export interface ReviewItem {
  id: string;
  type: 'word' | 'flashcard'; // Từ admin hoặc flashcard user
  itemId: string;
  content: Flashcard | Word;
  nextReview: Date;
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}

export interface UserProgress {
  itemId: string; // Course, Topic, Material ID
  itemType: 'course' | 'topic' | 'material';
  completedItems: string[]; // IDs của words/flashcards/quizzes đã hoàn thành
  score: number;
  lastStudied: string;
}
