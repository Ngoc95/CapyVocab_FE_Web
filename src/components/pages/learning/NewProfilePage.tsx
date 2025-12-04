import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { useAuthStore } from '../../../utils/authStore';
import { 
  Settings, 
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  Flame,
  Shield
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const userData = {
  name: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  avatar: '',
  streak: 7,
  joinDate: 'January 2024',
};

const stats = [
  { label: 'Words Learned', value: '487', icon: BookOpen, color: 'text-primary' },
  { label: 'Tổng ngày học', value: '45', icon: Calendar, color: 'text-success' },
  { label: 'Day Streak', value: '7', icon: Flame, color: 'text-warning' },
  { label: 'Số dư (VNĐ)', value: '150K', icon: TrendingUp, color: 'text-purple-500' },
];

const weeklyActivity = [
  { day: 'Mon', lessons: 3 },
  { day: 'Tue', lessons: 2 },
  { day: 'Wed', lessons: 4 },
  { day: 'Thu', lessons: 2 },
  { day: 'Fri', lessons: 5 },
  { day: 'Sat', lessons: 6 },
  { day: 'Sun', lessons: 4 },
];

const progressData = [
  { month: 'Jan', words: 45 },
  { month: 'Feb', words: 78 },
  { month: 'Mar', words: 120 },
  { month: 'Apr', words: 95 },
  { month: 'May', words: 149 },
];

const achievements = [
  { emoji: '🏆', title: 'First Lesson', description: 'Completed your first lesson', unlocked: true },
  { emoji: '⭐', title: '7 Day Streak', description: 'Learned 7 days in a row', unlocked: true },
  { emoji: '🎯', title: '50 Words', description: 'Learned 50 vocabulary words', unlocked: true },
  { emoji: '🔥', title: 'Hot Streak', description: 'Maintain a 30-day streak', unlocked: false },
  { emoji: '💯', title: 'Perfect Score', description: 'Get 100% on any quiz', unlocked: true },
  { emoji: '📚', title: 'Bookworm', description: 'Complete 10 lessons', unlocked: true },
  { emoji: '🎓', title: 'Graduate', description: 'Reach Advanced level', unlocked: false },
  { emoji: '👑', title: 'Word Master', description: 'Learn 1000 words', unlocked: false },
];

export function NewProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Profile Header */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl">{user?.name}</h1>
                    {user?.role === 'admin' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Member since {userData.joinDate}
                  </p>
                </div>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-warning fill-warning" />
                <span>{userData.streak} day streak</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color.split('-')[1]}/10 rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Hoạt động tuần này</CardTitle>
            <CardDescription>Số bài học đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="lessons" fill="#1AB1F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ học tập</CardTitle>
            <CardDescription>Số từ vựng học được mỗi tháng</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="words" 
                  stroke="#1AB1F6" 
                  strokeWidth={3}
                  dot={{ fill: '#1AB1F6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}