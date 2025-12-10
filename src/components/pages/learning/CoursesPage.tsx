import { Link } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { courseService, Course } from '../../../services/courseService';

export function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    courseService.getCourses({ limit: 100 })
      .then((res) => setCourses(res.metaData.courses || []))
      .catch(() => setCourses([]));
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advance': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <Link to={`/courses/${course.id}`}>
      <Card className="hover:shadow-lg transition-all">
        <CardContent className="pt-6 space-y-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">📚</div>

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-lg">{course.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge className={getLevelColor(course.level)} variant="outline">
              {course.level}
            </Badge>
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
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
