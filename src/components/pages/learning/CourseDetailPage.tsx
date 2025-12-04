import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Lock, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { getCourseById, getTopicsByCourseId } from '../../../utils/mockData';

export function CourseDetailPage() {
  const { id } = useParams();
  const mockCourse = getCourseById(id || '3') || {
    id: '3',
    name: 'Daily Conversation',
    description: 'Giao tiếp hàng ngày trong cuộc sống',
    level: 'Beginner',
    thumbnail: '🗣️',
    progress: 35,
    topicCount: 12,
  };
  const mockTopics = getTopicsByCourseId(id || '3');
  const completedTopics = mockTopics.filter(t => t.isCompleted).length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại khóa học
        </Button>
      </Link>

      {/* Course Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
            {mockCourse.thumbnail}
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-3xl font-bold">{mockCourse.name}</h1>
              <p className="text-muted-foreground mt-1">{mockCourse.description}</p>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                {mockCourse.level}
              </Badge>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{mockCourse.totalTopics} chủ đề</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ khóa học</span>
              <span className="text-sm text-muted-foreground">
                {completedTopics} / {mockCourse.topicCount} chủ đề
              </span>
            </div>
            <Progress value={mockCourse.progress} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {mockCourse.progress}% hoàn thành
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Topics List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Các chủ đề</h2>
        {mockTopics.map((topic, index) => {
          const isNextTopic = !topic.isCompleted && 
            mockTopics.slice(0, index).every(t => t.isCompleted) &&
            !topic.isLocked;

          return (
            <Card 
              key={topic.id}
              className={`hover:shadow-md transition-all ${
                topic.isLocked ? 'opacity-60' : ''
              } ${isNextTopic ? 'border-primary border-2' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Topic Icon & Status */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl ${
                    topic.isCompleted 
                      ? 'bg-success/10' 
                      : topic.isLocked
                      ? 'bg-muted'
                      : 'bg-primary/10'
                  }`}>
                    {topic.isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    ) : topic.isLocked ? (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      topic.thumbnail
                    )}
                  </div>

                  {/* Topic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{topic.name}</h3>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <BookOpen className="w-3 h-3" />
                            <span>{topic.wordCount} từ</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{topic.duration}</span>
                          </div>
                          {topic.isCompleted && (
                            <Badge className="bg-success/10 text-success border-success/20 text-xs" variant="outline">
                              Hoàn thành
                            </Badge>
                          )}
                          {isNextTopic && (
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs" variant="outline">
                              Tiếp theo
                            </Badge>
                          )}
                        </div>
                        {!topic.isCompleted && !topic.isLocked && topic.progress > 0 && (
                          <div className="mt-2">
                            <Progress value={topic.progress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      {!topic.isLocked && (
                        <Link to={`/topics/${topic.id}`}>
                          <Button size="sm" variant={topic.isCompleted ? 'outline' : 'default'}>
                            {topic.isCompleted ? 'Ôn lại' : topic.progress > 0 ? 'Tiếp tục' : 'Bắt đầu'}
                          </Button>
                        </Link>
                      )}
                      {topic.isLocked && (
                        <Button size="sm" variant="outline" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Đã khóa
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
      {mockCourse.progress < 100 && (
        <div className="sticky bottom-4 md:bottom-6">
          <Card className="border-2 border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">Sẵn sàng học tiếp?</p>
                  <p className="text-sm text-muted-foreground">
                    Tiếp tục từ nơi bạn đã dừng lại
                  </p>
                </div>
                <Link to={`/topics/${mockTopics.find(t => !t.isCompleted && !t.isLocked)?.id}`}>
                  <Button size="lg">
                    Tiếp tục học
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Completion */}
      {mockCourse.progress === 100 && (
        <Card className="border-2 border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold">Chúc mừng!</h3>
                <p className="text-muted-foreground mt-1">
                  Bạn đã hoàn thành khóa học này. Hãy ôn tập thường xuyên để ghi nhớ từ vựng!
                </p>
              </div>
              <Link to="/review">
                <Button size="lg">
                  Ôn tập ngay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
