import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock,
  Play,
  ChevronRight,
  Flame,
  Award,
  Zap
} from 'lucide-react';
import { Progress } from '../../ui/progress';

const dailyGoal = {
  current: 85,
  target: 100,
  unit: 'XP',
};

const streakDays = 7;

const todayTasks = [
  { id: 1, title: 'Review 10 flashcards', completed: true, xp: 20 },
  { id: 2, title: 'Complete a lesson', completed: true, xp: 30 },
  { id: 3, title: 'Take a quiz', completed: false, xp: 25 },
  { id: 4, title: 'Learn 5 new words', completed: false, xp: 25 },
];

const continuelearning = [
  {
    id: 'topic-1',
    title: 'Daily Conversation',
    type: 'Vocabulary',
    progress: 45,
    thumbnail: '🗣️',
  },
  {
    id: 'lesson-2',
    title: 'Everyday Conversations',
    type: 'Lesson',
    progress: 38,
    thumbnail: '💬',
  },
];

const quickActions = [
  { icon: BookOpen, label: 'Vocabulary', color: 'bg-blue-500', path: '/vocabulary' },
  { icon: Brain, label: 'Review', color: 'bg-purple-500', path: '/review' },
  { icon: Target, label: 'Quiz', color: 'bg-green-500', path: '/quiz' },
  { icon: TrendingUp, label: 'Progress', color: 'bg-orange-500', path: '/profile' },
];

const recentAchievements = [
  { emoji: '🏆', title: 'First Lesson', date: 'Today' },
  { emoji: '⭐', title: '7 Day Streak', date: 'Today' },
  { emoji: '🎯', title: '50 Words Learned', date: 'Yesterday' },
];

export function NewHomePage() {
  const progressPercentage = (dailyGoal.current / dailyGoal.target) * 100;
  const completedTasks = todayTasks.filter(t => t.completed).length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, User! 👋</h1>
        <p className="text-muted-foreground">
          Let's continue your English learning journey
        </p>
      </div>

      {/* Daily Progress & Streak */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Daily Goal */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Daily Goal</CardTitle>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-warning fill-warning" />
                <span className="font-bold text-xl">
                  {dailyGoal.current}/{dailyGoal.target}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {dailyGoal.target - dailyGoal.current} XP to reach your goal
            </p>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Streak</CardTitle>
              <Flame className="w-6 h-6 text-warning fill-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-warning">{streakDays}</span>
              <span className="text-xl text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Keep it up! Learn every day to maintain your streak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path}>
              <Card className="hover:shadow-lg transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="font-medium text-center">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>
                {completedTasks}/{todayTasks.length} completed
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              +{todayTasks.reduce((sum, t) => sum + t.xp, 0)} XP
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-4 rounded-lg border ${
                task.completed 
                  ? 'bg-success/5 border-success/20' 
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                task.completed 
                  ? 'bg-success border-success' 
                  : 'border-muted-foreground'
              }`}>
                {task.completed && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`flex-1 ${task.completed ? 'text-muted-foreground line-through' : ''}`}>
                {task.title}
              </span>
              <Badge variant="outline" className="text-xs">
                +{task.xp} XP
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Continue Learning</h2>
          <Link to="/browse">
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {continuelearning.map((item) => (
            <Link key={item.id} to={item.type === 'Vocabulary' ? `/vocabulary/${item.id}` : `/lessons/${item.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {item.thumbnail}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2 text-xs">
                          {item.type}
                        </Badge>
                        <h3 className="font-semibold">{item.title}</h3>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                      <Button size="sm" className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Recent Achievements
          </CardTitle>
          <CardDescription>Celebrate your progress!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <div className="text-4xl">{achievement.emoji}</div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
