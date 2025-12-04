import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  ChevronRight
} from 'lucide-react';

const mockLessonData = {
  id: 'lesson-2',
  title: 'Everyday Conversations',
  description: 'Practice common phrases for daily interactions',
  level: 'Beginner',
  duration: '45 min',
  thumbnail: '💬',
  modules: [
    {
      id: 1,
      title: 'Greetings and Introductions',
      duration: '8 min',
      completed: true,
      locked: false,
    },
    {
      id: 2,
      title: 'Asking for Directions',
      duration: '10 min',
      completed: true,
      locked: false,
    },
    {
      id: 3,
      title: 'Ordering Food',
      duration: '12 min',
      completed: true,
      locked: false,
    },
    {
      id: 4,
      title: 'Shopping Phrases',
      duration: '10 min',
      completed: false,
      locked: false,
    },
    {
      id: 5,
      title: 'Making Small Talk',
      duration: '8 min',
      completed: false,
      locked: false,
    },
    {
      id: 6,
      title: 'Phone Conversations',
      duration: '12 min',
      completed: false,
      locked: false,
    },
    {
      id: 7,
      title: 'Apologizing and Thanking',
      duration: '7 min',
      completed: false,
      locked: false,
    },
    {
      id: 8,
      title: 'Advanced Conversation Practice',
      duration: '15 min',
      completed: false,
      locked: false,
    },
  ],
};

export function LessonDetailPage() {
  const { id } = useParams();
  const completedModules = mockLessonData.modules.filter(m => m.completed).length;
  const progress = (completedModules / mockLessonData.modules.length) * 100;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      {/* Back Button */}
      <Link to="/lessons">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Button>
      </Link>

      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
            {mockLessonData.thumbnail}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{mockLessonData.title}</h1>
                <p className="text-muted-foreground mt-1">{mockLessonData.description}</p>
              </div>
              <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                {mockLessonData.level}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{mockLessonData.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{mockLessonData.modules.length} modules</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedModules} / {mockLessonData.modules.length} modules
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {progress === 100 
                ? '🎉 Congratulations! You completed this lesson!' 
                : `${Math.round(progress)}% complete - Keep going!`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Lesson Modules</h2>
        {mockLessonData.modules.map((module, index) => {
          const isNextModule = !module.completed && mockLessonData.modules
            .slice(0, index)
            .every(m => m.completed);

          return (
            <Card 
              key={module.id}
              className={`hover:shadow-md transition-all ${
                module.locked ? 'opacity-60' : ''
              } ${isNextModule ? 'border-primary border-2' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Module Number & Status */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    module.completed 
                      ? 'bg-success text-white' 
                      : module.locked
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {module.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : module.locked ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>

                  {/* Module Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{module.duration}</span>
                          </div>
                          {module.completed && (
                            <Badge className="bg-success/10 text-success border-success/20 text-xs" variant="outline">
                              Completed
                            </Badge>
                          )}
                          {isNextModule && !module.completed && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">
                              Continue Here
                            </Badge>
                          )}
                        </div>
                      </div>
                      {!module.locked && (
                        <Button size="sm" variant={module.completed ? 'outline' : 'default'}>
                          {module.completed ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Review
                            </>
                          ) : (
                            <>
                              {isNextModule ? 'Continue' : 'Start'}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      )}
                      {module.locked && (
                        <Button size="sm" variant="outline" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Continue Button */}
      {progress < 100 && (
        <div className="sticky bottom-4 md:bottom-6">
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Ready to continue?</p>
                  <p className="text-sm text-muted-foreground">
                    Pick up where you left off
                  </p>
                </div>
                <Button size="lg">
                  Continue Learning
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completion Certificate */}
      {progress === 100 && (
        <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold">Lesson Completed!</h3>
                <p className="text-muted-foreground mt-1">
                  Great job! You've completed all modules in this lesson.
                </p>
              </div>
              <Button size="lg" className="bg-success hover:bg-success/90">
                Download Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
