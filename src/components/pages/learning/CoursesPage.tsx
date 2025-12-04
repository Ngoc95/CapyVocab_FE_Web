import { Link } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Users, BookOpen } from 'lucide-react';
import { mockCourses } from '../../../utils/mockData';

export function CoursesPage() {
  // Tất cả courses do admin tạo đều miễn phí cho user
  const allCourses = mockCourses;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const CourseCard = ({ course }: { course: typeof mockCourses[0] }) => (
    <Link to={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="pt-6 space-y-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">
            {course.thumbnail}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge className={getLevelColor(course.level)} variant="outline">
              {course.level}
            </Badge>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.topicCount} chủ đề</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.studentCount}</span>
            </div>
          </div>

          {/* Word count */}
          <div className="pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              {course.wordCount} từ vựng
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Học từ vựng</h1>
        <p className="text-muted-foreground mt-1">
          Khám phá các khóa học từ vựng được quản trị viên tạo ra
        </p>
      </div>

      {/* All Courses */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tất cả khóa học</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}