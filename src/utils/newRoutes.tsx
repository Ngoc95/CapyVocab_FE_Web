import { createBrowserRouter, Navigate } from 'react-router';
import { LearningLayout } from '../components/layouts/LearningLayout';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from '../components/pages/auth/LoginPage';
import { RegisterPage } from '../components/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../components/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../components/pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../components/pages/auth/VerifyEmailPage';
import { CoursesPage } from '../components/pages/learning/CoursesPage';
import { CourseDetailPage } from '../components/pages/learning/CourseDetailPage';
import { TopicDetailPage } from '../components/pages/learning/TopicDetailPage';
import { FlashcardsPage } from '../components/pages/learning/FlashcardsPage';
import { QuizPage } from '../components/pages/learning/QuizPage';
import { MaterialsPage } from '../components/pages/learning/MaterialsPage';
import { CreateMaterialPage } from '../components/pages/learning/CreateMaterialPage';
import { MaterialDetailPage } from '../components/pages/learning/MaterialDetailPage';
import { MaterialFlashcardsPage } from '../components/pages/learning/MaterialFlashcardsPage';
import { MaterialQuizPage } from '../components/pages/learning/MaterialQuizPage';
import { CommunityPage } from '../components/pages/learning/CommunityPage';
import { PostDetailPage } from '../components/pages/learning/PostDetailPage';
import { NewReviewPage } from '../components/pages/learning/NewReviewPage';
import { NewProfilePage } from '../components/pages/learning/NewProfilePage';
import { AdminDashboardPage } from '../components/pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from '../components/pages/admin/AdminCoursesPage';
import { AdminCourseDetailPage } from '../components/pages/admin/AdminCourseDetailPage';
import { AdminTopicDetailPage } from '../components/pages/admin/AdminTopicDetailPage';
import { AdminTopicsPage } from '../components/pages/admin/AdminTopicsPage';
import { AdminVocabularyPage } from '../components/pages/admin/AdminVocabularyPage';
import { AdminUsersPage } from '../components/pages/admin/AdminUsersPage';
import { AdminWithdrawPage } from '../components/pages/admin/AdminWithdrawPage';
import { AdminReportsPage } from '../components/pages/admin/AdminReportsPage';
import { AdminSupportPage } from '../components/pages/admin/AdminSupportPage';
import { NotFoundPage } from '../components/pages/NotFoundPage';
import { PaymentCallbackPage } from '../components/pages/payment/PaymentCallbackPage';

export const router = createBrowserRouter([
  // Redirect root to courses (protected)
  {
    path: '/',
    element: <Navigate to="/courses" replace />,
  },
  
  // Auth routes (no layout)
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/forgot-password',
    Component: ForgotPasswordPage,
  },
  {
    path: '/reset-password',
    Component: ResetPasswordPage,
  },
  {
    path: '/verify-email',
    Component: VerifyEmailPage,
  },
  {
    path: '/payment/callback',
    Component: PaymentCallbackPage,
  },
  
  // Learning site routes (with LearningLayout) - Protected
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <LearningLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'courses', Component: CoursesPage },
      { path: 'courses/:id', Component: CourseDetailPage },
      { path: 'topics/:id', Component: TopicDetailPage },
      { path: 'flashcards/:id', Component: FlashcardsPage },
      { path: 'quiz/:id', Component: QuizPage },
      { path: 'materials', Component: MaterialsPage },
      { path: 'materials/create', Component: CreateMaterialPage },
      { path: 'materials/:id', Component: MaterialDetailPage },
      { path: 'materials/:id/edit', Component: CreateMaterialPage },
      { path: 'materials/:id/flashcards', Component: MaterialFlashcardsPage },
      { path: 'materials/:id/quiz', Component: MaterialQuizPage },
      { path: 'community', Component: CommunityPage },
      { path: 'community/:postId', Component: PostDetailPage },
      { path: 'review', Component: NewReviewPage },
      { path: 'profile', Component: NewProfilePage },
    ],
  },

  // Admin routes (with AdminLayout) - Protected, admin only
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', Component: AdminDashboardPage },
      { path: 'courses', Component: AdminCoursesPage },
      { path: 'courses/:courseId', Component: AdminCourseDetailPage },
      { path: 'topics/:topicId', Component: AdminTopicDetailPage },
      { path: 'topics', Component: AdminTopicsPage },
      { path: 'vocabulary', Component: AdminVocabularyPage },
      { path: 'users', Component: AdminUsersPage },
      { path: 'withdraw', Component: AdminWithdrawPage },
      { path: 'reports', Component: AdminReportsPage },
      { path: 'support', Component: AdminSupportPage },
    ],
  },

  // 404
  {
    path: '*',
    Component: NotFoundPage,
  },
]);
