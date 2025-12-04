import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Search, Play, Lock, CheckCircle2, Clock, Award } from 'lucide-react';
import { Progress } from '../../ui/progress';

const lessons = [
  {
    id: 'lesson-1',
    title: 'Introduction to English',
    description: 'Learn the basics of English grammar and pronunciation',
    level: 'Beginner',
    duration: '30 min',
    lessons: 5,
    completed: 5,
    locked: false,
    thumbnail: '📚',
  },
  {
    id: 'lesson-2',
    title: 'Everyday Conversations',
    description: 'Practice common phrases for daily interactions',
    level: 'Beginner',
    duration: '45 min',
    lessons: 8,
    completed: 3,
    locked: false,
    thumbnail: '💬',
  },
  {
    id: 'lesson-3',
    title: 'Grammar Fundamentals',
    description: 'Master the essential grammar rules',
    level: 'Intermediate',
    duration: '60 min',
    lessons: 10,
    completed: 0,
    locked: false,
    thumbnail: '📝',
  },
  {
    id: 'lesson-4',
    title: 'Business English',
    description: 'Professional communication skills',
    level: 'Intermediate',
    duration: '50 min',
    lessons: 12,
    completed: 0,
    locked: true,
    thumbnail: '💼',
  },
  {
    id: 'lesson-5',
    title: 'Advanced Speaking',
    description: 'Improve your fluency and confidence',
    level: 'Advanced',
    duration: '40 min',
    lessons: 7,
    completed: 0,
    locked: true,
    thumbnail: '🎤',
  },
  {
    id: 'lesson-6',
    title: 'IELTS Preparation',
    description: 'Get ready for the IELTS exam',
    level: 'Advanced',
    duration: '90 min',
    lessons: 15,
    completed: 0,
    locked: true,
    thumbnail: '🎓',
  },
];

const stats = [
  { label: 'Completed Lessons', value: '8', icon: CheckCircle2, color: 'text-success' },
  { label: 'Hours Learned', value: '12.5', icon: Clock, color: 'text-primary' },
  { label: 'Achievements', value: '5', icon: Award, color: 'text-warning' },
];

export function LessonsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="text-muted-foreground">
          Structured courses to improve your English skills
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${stat.color.split('-')[1]}/10 rounded-lg flex items-center justify-center`}>
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search lessons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Learning Path */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Learning Path</h2>
        <div className="space-y-4">
          {filteredLessons.map((lesson, index) => {
            const progress = (lesson.completed / lesson.lessons) * 100;
            const isCompleted = lesson.completed === lesson.lessons;

            return (
              <Card 
                key={lesson.id} 
                className={`hover:shadow-lg transition-all ${lesson.locked ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 relative">
                      {lesson.thumbnail}
                      {lesson.locked && (
                        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{lesson.title}</h3>
                            {isCompleted && (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                        </div>
                        {!lesson.locked && (
                          <Link to={`/lessons/${lesson.id}`}>
                            <Button size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              {lesson.completed > 0 ? 'Continue' : 'Start'}
                            </Button>
                          </Link>
                        )}
                        {lesson.locked && (
                          <Button size="sm" variant="outline" disabled>
                            <Lock className="w-4 h-4 mr-2" />
                            Locked
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className={getLevelColor(lesson.level)} variant="outline">
                          {lesson.level}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {lesson.lessons} lessons
                        </span>
                      </div>

                      {!lesson.locked && lesson.completed > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {lesson.completed}/{lesson.lessons} lessons
                            </span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Keep up the great work!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['🏆', '⭐', '🎯', '🔥', '💯'].map((emoji, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl">{emoji}</div>
                <p className="text-xs text-center text-muted-foreground">
                  {index === 0 ? 'First Lesson' : 
                   index === 1 ? '5 Day Streak' :
                   index === 2 ? '10 Words Learned' :
                   index === 3 ? 'Quiz Master' : 
                   'Perfect Score'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
