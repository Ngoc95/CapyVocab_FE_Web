import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Folder as FolderIcon,
  Eye,
  Heart,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

// Mock data for Overview Tab
const stats = [
  {
    title: 'Tổng người dùng',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Từ vựng',
    value: '1,847',
    change: '+8.2%',
    trend: 'up',
    icon: BookOpen,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    title: 'Khóa học',
    value: '156',
    change: '+5.1%',
    trend: 'up',
    icon: GraduationCap,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    title: 'Tỷ lệ hoạt động',
    value: '87.5%',
    change: '-2.3%',
    trend: 'down',
    icon: TrendingUp,
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
  },
];

const userGrowth = [
  { month: 'Thg 1', users: 450 },
  { month: 'Thg 2', users: 680 },
  { month: 'Thg 3', users: 920 },
  { month: 'Thg 4', users: 1150 },
  { month: 'Thg 5', users: 1580 },
  { month: 'Thg 6', users: 1890 },
  { month: 'Thg 7', users: 2130 },
  { month: 'Thg 8', users: 2543 },
];

const levelDistribution = [
  { name: 'Sơ cấp', value: 1250, color: '#10B981' },
  { name: 'Trung cấp', value: 980, color: '#F59E0B' },
  { name: 'Cao cấp', value: 313, color: '#EF4444' },
];

const activityData = [
  { day: 'T2', lessons: 85, quizzes: 45, flashcards: 120 },
  { day: 'T3', lessons: 95, quizzes: 52, flashcards: 135 },
  { day: 'T4', lessons: 78, quizzes: 38, flashcards: 98 },
  { day: 'T5', lessons: 110, quizzes: 68, flashcards: 155 },
  { day: 'T6', lessons: 125, quizzes: 75, flashcards: 178 },
  { day: 'T7', lessons: 142, quizzes: 88, flashcards: 195 },
  { day: 'CN', lessons: 105, quizzes: 58, flashcards: 142 },
];

const recentActivities = [
  { user: 'John Doe', action: 'Hoàn thành khóa học "Business English"', time: '5 phút trước' },
  { user: 'Jane Smith', action: 'Thêm 15 từ vựng mới', time: '12 phút trước' },
  { user: 'Mike Johnson', action: 'Đạt chuỗi 30 ngày', time: '1 giờ trước' },
  { user: 'Sarah Wilson', action: 'Tạo bài quiz "Grammar Basics"', time: '2 giờ trước' },
  { user: 'Admin', action: 'Cập nhật nội dung khóa học', time: '3 giờ trước' },
];

// Revenue data
const revenueData = {
  total: '2,450,000đ',
  yesterday: '85,000đ',
  today: '120,000đ',
  growth: '+15.2%',
  weekly: [
    { day: 'T2', amount: 85000 },
    { day: 'T3', amount: 92000 },
    { day: 'T4', amount: 78000 },
    { day: 'T5', amount: 105000 },
    { day: 'T6', amount: 118000 },
    { day: 'T7', amount: 135000 },
    { day: 'CN', amount: 120000 },
  ],
  monthly: [
    { month: 'Thg 1', amount: 320000 },
    { month: 'Thg 2', amount: 380000 },
    { month: 'Thg 3', amount: 450000 },
    { month: 'Thg 4', amount: 520000 },
    { month: 'Thg 5', amount: 480000 },
    { month: 'Thg 6', amount: 590000 },
  ],
  yearly: [
    { year: '2020', amount: 2800000 },
    { year: '2021', amount: 3500000 },
    { year: '2022', amount: 4200000 },
    { year: '2023', amount: 5100000 },
    { year: '2024', amount: 6800000 },
  ],
};

// User data
const userData = {
  total: 2543,
  newToday: 45,
  activeToday: 1820,
  growth: '+12.5%',
  sevenDays: {
    newUsers: [
      { day: 'T2', users: 12 },
      { day: 'T3', users: 15 },
      { day: 'T4', users: 8 },
      { day: 'T5', users: 20 },
      { day: 'T6', users: 18 },
      { day: 'T7', users: 22 },
      { day: 'CN', users: 16 },
    ],
    activeUsers: [
      { day: 'T2', users: 1280 },
      { day: 'T3', users: 1395 },
      { day: 'T4', users: 1268 },
      { day: 'T5', users: 1510 },
      { day: 'T6', users: 1625 },
      { day: 'T7', users: 1498 },
      { day: 'CN', users: 1245 },
    ],
  },
  thirtyDays: {
    newUsers: [
      { day: '1', users: 45 },
      { day: '5', users: 52 },
      { day: '10', users: 48 },
      { day: '15', users: 65 },
      { day: '20', users: 58 },
      { day: '25', users: 70 },
      { day: '30', users: 62 },
    ],
    activeUsers: [
      { day: '1', users: 1250 },
      { day: '5', users: 1270 },
      { day: '10', users: 1385 },
      { day: '15', users: 1400 },
      { day: '20', users: 1520 },
      { day: '25', users: 1640 },
      { day: '30', users: 1760 },
    ],
  },
};

// Course data
const courseData = {
  total: 123,
  levelDistribution: [
    { name: 'Sơ cấp', value: 54, color: '#4CAF50' },
    { name: 'Trung cấp', value: 42, color: '#FF9800' },
    { name: 'Cao cấp', value: 27, color: '#F44336' },
  ],
  completionRate: [
    { name: 'Đã hoàn thành', value: 1250, percentage: 27.3, color: '#1AB1F6' },
    { name: 'Đang học', value: 2340, percentage: 51.1, color: '#FFA726' },
    { name: 'Chưa học', value: 890, percentage: 21.6, color: '#BDBDBD' },
  ],
  topCourses: [
    {
      id: 1,
      name: '1000 TỪ CƠ BẢN',
      level: 'Sơ cấp',
      enrollments: 334,
      topics: [
        { id: 1, name: 'Friendship', words: 20, enrollments: 300 },
        { id: 2, name: 'Personal Experiences', words: 18, enrollments: 280 },
        { id: 3, name: 'Daily Activities', words: 25, enrollments: 290 },
      ],
    },
    {
      id: 2,
      name: 'Business English Pro',
      level: 'Cao cấp',
      enrollments: 298,
      topics: [
        { id: 4, name: 'Negotiations', words: 30, enrollments: 250 },
        { id: 5, name: 'Presentations', words: 28, enrollments: 240 },
      ],
    },
    {
      id: 3,
      name: 'Travel English',
      level: 'Trung cấp',
      enrollments: 256,
      topics: [
        { id: 6, name: 'At the Airport', words: 22, enrollments: 220 },
        { id: 7, name: 'Hotel Booking', words: 20, enrollments: 210 },
      ],
    },
  ],
};

// Topic data
const topicData = {
  total: 165,
  completionRate: [
    { name: 'Đã hoàn thành', percentage: 64, color: '#1AB1F6' },
    { name: 'Chưa hoàn thành', percentage: 36, color: '#BDBDBD' },
  ],
  topTopics: [
    { id: 1, name: 'Friendship', words: 20, enrollments: 334 },
    { id: 2, name: 'Personal Experiences', words: 18, enrollments: 304 },
    { id: 3, name: 'Daily Activities', words: 25, enrollments: 289 },
    { id: 4, name: 'Business Meeting', words: 22, enrollments: 267 },
    { id: 5, name: 'Travel Vocabulary', words: 30, enrollments: 245 },
  ],
};

// Folder data
const folderData = {
  total: 400,
  free: 266,
  paid: 134,
  distribution: [
    { name: 'Miễn phí', percentage: 66.5, color: '#1AB1F6' },
    { name: 'Có phí', percentage: 33.5, color: '#4CAF50' },
  ],
  avgPrice: '30,000đ',
  topFolders: [
    {
      id: 1,
      name: 'Bài tập chương 3',
      totalWords: 50,
      creator: 'ddddd@gmail.com',
      price: '20.9k đồng',
      isFree: false,
      participants: 200,
      likes: 200,
      comments: 20,
      flashcards: [
        { id: 1, name: 'Set 1 - Basic Vocabulary', cards: 25 },
        { id: 2, name: 'Set 2 - Advanced Terms', cards: 25 },
      ],
      quizzes: [
        { id: 1, name: 'Quiz 1 - Chapter Review', questions: 20 },
        { id: 2, name: 'Quiz 2 - Final Test', questions: 30 },
      ],
    },
    {
      id: 2,
      name: 'IELTS Vocabulary Master',
      totalWords: 120,
      creator: 'teacher@gmail.com',
      price: 'Miễn phí',
      isFree: true,
      participants: 350,
      likes: 280,
      comments: 45,
      flashcards: [
        { id: 3, name: 'Academic Words', cards: 60 },
        { id: 4, name: 'Common Phrases', cards: 60 },
      ],
      quizzes: [
        { id: 3, name: 'Practice Test 1', questions: 40 },
      ],
    },
    {
      id: 3,
      name: 'TOEIC 600+ Essential',
      totalWords: 85,
      creator: 'student@gmail.com',
      price: '15k đồng',
      isFree: false,
      participants: 180,
      likes: 150,
      comments: 28,
      flashcards: [
        { id: 5, name: 'Business Vocabulary', cards: 45 },
        { id: 6, name: 'Grammar Focus', cards: 40 },
      ],
      quizzes: [
        { id: 4, name: 'Mock Test', questions: 50 },
      ],
    },
  ],
};

export function AdminDashboardPage() {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [revenueChartType, setRevenueChartType] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [userChartPeriod, setUserChartPeriod] = useState<'sevenDays' | 'thirtyDays'>('sevenDays');
  const [userChartType, setUserChartType] = useState<'newUsers' | 'activeUsers'>('newUsers');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl">Trang chủ</h1>
        <p className="text-muted-foreground mt-1">
          Tổng quan và thống kê chi tiết về nền tảng CapyVocab
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="revenue">Lợi nhuận</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="courses">Khóa học</TabsTrigger>
          <TabsTrigger value="topics">Chủ đề</TabsTrigger>
          <TabsTrigger value="folders">Folder</TabsTrigger>
        </TabsList>

        {/* ============ TỔNG QUAN TAB ============ */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl">{stat.value}</p>
                      <div className="flex items-center gap-1">
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-success" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-destructive" />
                        )}
                        <span
                          className={`text-sm ${
                            stat.trend === 'up' ? 'text-success' : 'text-destructive'
                          }`}
                        >
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center`}>
                      <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Growth */}
            <Card>
              <CardHeader>
                <CardTitle>Tăng trưởng người dùng</CardTitle>
                <CardDescription>Tổng số người dùng theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={userGrowth}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1AB1F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1AB1F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#1AB1F6"
                      strokeWidth={3}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Level Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố cấp độ</CardTitle>
                <CardDescription>Người dùng theo trình độ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width="60%" height={250}>
                    <PieChart>
                      <Pie
                        data={levelDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {levelDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {levelDistribution.map((level, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: level.color }}
                          />
                          <span className="text-sm">{level.name}</span>
                        </div>
                        <span className="text-sm">{level.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động trong tuần</CardTitle>
              <CardDescription>Mức độ tương tác của người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="lessons" name="Bài học" fill="#1AB1F6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="quizzes" name="Bài kiểm tra" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="flashcards" name="Flashcards" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>Các hành động mới nhất trên nền tảng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-primary">
                        {activity.user[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ LỢI NHUẬN TAB ============ */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tổng lợi nhuận</p>
                    <p className="text-3xl">{revenueData.total}</p>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">{revenueData.growth}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lợi nhuận hôm qua</p>
                  <p className="text-3xl">{revenueData.yesterday}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lợi nhuận hôm nay</p>
                  <p className="text-3xl text-primary">{revenueData.today}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Trung bình/ngày</p>
                  <p className="text-3xl">95,000đ</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Biểu đồ lợi nhuận</CardTitle>
                  <CardDescription>Thống kê lợi nhuận theo thời gian</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={revenueChartType === 'weekly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRevenueChartType('weekly')}
                  >
                    Tuần
                  </Button>
                  <Button
                    variant={revenueChartType === 'monthly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRevenueChartType('monthly')}
                  >
                    Tháng
                  </Button>
                  <Button
                    variant={revenueChartType === 'yearly' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRevenueChartType('yearly')}
                  >
                    Năm
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={revenueData[revenueChartType]}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1AB1F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1AB1F6" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey={revenueChartType === 'yearly' ? 'year' : revenueChartType === 'monthly' ? 'month' : 'day'}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `${value.toLocaleString()}đ`}
                  />
                  <Bar dataKey="amount" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ NGƯỜI DÙNG TAB ============ */}
        <TabsContent value="users" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                    <p className="text-3xl">{userData.total.toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success">{userData.growth}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Người dùng mới hôm nay</p>
                  <p className="text-3xl text-green-600">{userData.newToday}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Đang hoạt động hôm nay</p>
                  <p className="text-3xl text-primary">{userData.activeToday.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tỷ lệ hoạt động</p>
                  <p className="text-3xl">71.6%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Charts */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Số người dùng {userChartType === 'newUsers' ? 'đăng ký mới' : 'hoạt động'}</CardTitle>
                  <CardDescription>
                    Thống kê trong {userChartPeriod === 'sevenDays' ? '7 ngày' : '30 ngày'} qua
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant={userChartType === 'newUsers' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserChartType('newUsers')}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Đăng ký mới
                    </Button>
                    <Button
                      variant={userChartType === 'activeUsers' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserChartType('activeUsers')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Đang hoạt động
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={userChartPeriod === 'sevenDays' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserChartPeriod('sevenDays')}
                    >
                      7 ngày
                    </Button>
                    <Button
                      variant={userChartPeriod === 'thirtyDays' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setUserChartPeriod('thirtyDays')}
                    >
                      30 ngày
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={userData[userChartPeriod][userChartType]}>
                  <defs>
                    <linearGradient id="colorUserChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={userChartType === 'newUsers' ? '#4CAF50' : '#1AB1F6'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={userChartType === 'newUsers' ? '#4CAF50' : '#1AB1F6'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke={userChartType === 'newUsers' ? '#4CAF50' : '#1AB1F6'}
                    strokeWidth={3}
                    fill="url(#colorUserChart)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ KHÓA HỌC TAB ============ */}
        <TabsContent value="courses" className="space-y-6">
          {/* Total Courses */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tổng quan khóa học</p>
                  <p className="text-3xl">{courseData.total} khóa học</p>
                </div>
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Distribution by Level */}
            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo cấp độ</CardTitle>
                <CardDescription>Số lượng khóa học theo từng cấp độ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2 flex-shrink-0">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={courseData.levelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {courseData.levelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    {courseData.levelDistribution.map((level, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: level.color }}
                          />
                          <span className="text-sm">{level.name}</span>
                        </div>
                        <div className="pl-5">
                          <span className="text-sm font-medium">{level.value} khóa</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Completion Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Tỉ lệ hoàn thành khóa học</CardTitle>
                <CardDescription>Trạng thái học tập của người dùng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={courseData.completionRate}
                          cx="40%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {courseData.completionRate.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    {courseData.completionRate.map((status, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-sm">{status.name}</span>
                        </div>
                        <div className="pl-5">
                          <span className="text-sm font-medium">{status.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Khóa học phổ biến</CardTitle>
              <CardDescription>Top các khóa học được học nhiều nhất (Click để xem chi tiết)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courseData.topCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1AB1F6] to-[#0891D1] text-white rounded-xl shadow-sm flex-shrink-0">
                      <span className="text-xl">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">Cấp độ: {course.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{course.enrollments} lượt học</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CHỦ ĐỀ TAB ============ */}
        <TabsContent value="topics" className="space-y-6">
          {/* Total Topics */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tổng chủ đề</p>
                  <p className="text-3xl">{topicData.total}</p>
                </div>
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Rate */}
          <Card>
            <CardHeader>
              <CardTitle>Tỉ lệ hoàn thành chủ đề</CardTitle>
              <CardDescription>Trạng thái hoàn thành của người dùng</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={topicData.completionRate}
                        cx="40%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="percentage"
                        label
                      >
                        {topicData.completionRate.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  {topicData.completionRate.map((status, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: status.color }}
                        />
                        <span>{status.name}:</span>
                        <span className="font-medium">{status.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Chủ đề phổ biến</CardTitle>
              <CardDescription>Top các chủ đề được học nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topicData.topTopics.map((topic, index) => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1AB1F6] to-[#0891D1] text-white rounded-xl shadow-sm flex-shrink-0">
                      <span className="text-xl">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{topic.name}</p>
                      <p className="text-sm text-muted-foreground">Số lượng từ: {topic.words}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{topic.enrollments} lượt học</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ FOLDER TAB ============ */}
        <TabsContent value="folders" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tổng folder</p>
                    <p className="text-3xl">{folderData.total}</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <FolderIcon className="w-7 h-7 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Miễn phí</p>
                  <p className="text-3xl text-[#1AB1F6]">{folderData.free}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Có phí</p>
                  <p className="text-3xl text-[#4CAF50]">{folderData.paid}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Giá trung bình</p>
                  <p className="text-3xl">{folderData.avgPrice}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố folder</CardTitle>
              <CardDescription>Tỷ lệ folder miễn phí và có phí</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={folderData.distribution}
                        cx="40%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="percentage"
                        label
                      >
                        {folderData.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4 w-full">
                  {folderData.distribution.map((dist, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dist.color }}
                        />
                        <span>{dist.name}:</span>
                        <span className="font-medium">{dist.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Folders */}
          <Card>
            <CardHeader>
              <CardTitle>Top folder phổ biến</CardTitle>
              <CardDescription>Các folder được tham gia nhiều nhất (Click để xem chi tiết)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {folderData.topFolders.map((folder, index) => (
                  <div
                    key={folder.id}
                    className="p-4 border rounded-xl hover:shadow-md hover:border-primary/50 cursor-pointer transition-all"
                    onClick={() => setSelectedFolder(folder)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#1AB1F6] to-[#0891D1] text-white rounded-xl shadow-sm flex-shrink-0">
                        <span className="text-xl">#{index + 1}</span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-medium">{folder.name}</p>
                          <Badge variant={folder.isFree ? 'secondary' : 'default'} className="flex-shrink-0">
                            {folder.price}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {folder.totalWords} từ
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {folder.participants} tham gia
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {folder.likes} thích
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {folder.comments} nhận xét
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Người tạo: {folder.creator}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ DIALOGS ============ */}
      {/* Course Detail Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết khóa học: {selectedCourse?.name}</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Cấp độ</p>
                    <p className="text-xl font-medium">{selectedCourse.level}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Lượt học</p>
                    <p className="text-xl font-medium">{selectedCourse.enrollments}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-medium mb-4">Các chủ đề trong khóa học</h3>
                <div className="space-y-3">
                  {selectedCourse.topics.map((topic: any) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="font-medium">{topic.name}</p>
                        <p className="text-sm text-muted-foreground">{topic.words} từ vựng</p>
                      </div>
                      <p className="text-sm font-medium">{topic.enrollments} lượt học</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Folder Detail Dialog */}
      <Dialog open={!!selectedFolder} onOpenChange={() => setSelectedFolder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết folder: {selectedFolder?.name}</DialogTitle>
          </DialogHeader>
          {selectedFolder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Người tạo</p>
                    <p className="text-sm font-medium">{selectedFolder.creator}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Giá</p>
                    <Badge variant={selectedFolder.isFree ? 'secondary' : 'default'}>
                      {selectedFolder.price}
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Tổng từ vựng</p>
                    <p className="text-xl font-medium">{selectedFolder.totalWords}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Lượt tham gia</p>
                    <p className="text-xl font-medium">{selectedFolder.participants}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Lượt thích</p>
                    <p className="text-xl font-medium">{selectedFolder.likes}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Nhận xét</p>
                    <p className="text-xl font-medium">{selectedFolder.comments}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-medium mb-4">Bộ Flashcard</h3>
                <div className="space-y-3">
                  {selectedFolder.flashcards.map((set: any) => (
                    <div
                      key={set.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-blue-50/50"
                    >
                      <p className="font-medium">{set.name}</p>
                      <Badge variant="secondary">{set.cards} thẻ</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4">Bộ Quiz</h3>
                <div className="space-y-3">
                  {selectedFolder.quizzes.map((quiz: any) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50"
                    >
                      <p className="font-medium">{quiz.name}</p>
                      <Badge variant="secondary">{quiz.questions} câu hỏi</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}