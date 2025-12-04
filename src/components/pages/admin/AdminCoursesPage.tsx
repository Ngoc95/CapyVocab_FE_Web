import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAdminStore } from '../../../utils/adminStore';
import { CourseFormDialog } from '../../admin/CourseFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';

export function AdminCoursesPage() {
  const navigate = useNavigate();
  const { courses, addCourse, updateCourse, deleteCourse } = useAdminStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(undefined);
  const [deletingCourse, setDeletingCourse] = useState<any>(undefined);

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level.toLowerCase() === levelFilter;
    const matchesStatus = statusFilter === 'all' || course.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleAdd = () => {
    setEditingCourse(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (courseData: any) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
  };

  const handleDelete = (deleteCompletely: boolean) => {
    if (deletingCourse) {
      // Với courses, luôn xóa hoàn toàn vì không có parent
      deleteCourse(deletingCourse.id);
    }
  };

  const handleView = (courseId: string) => {
    navigate(`/admin/courses/${courseId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Khóa học</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các khóa học trên nền tảng
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm khóa học
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Tổng khóa học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {courses.filter((c) => c.status === 'Published').length}
            </div>
            <p className="text-xs text-muted-foreground">Đang công khai</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.topicIds.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng chủ đề</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">Miễn phí</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Cấp độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp độ</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khóa học</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell onClick={() => handleView(course.id)}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                        {course.thumbnail || '📚'}
                      </div>
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-sm text-muted-foreground">{course.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleView(course.id)}>
                    <Badge variant="outline">{course.level}</Badge>
                  </TableCell>
                  <TableCell onClick={() => handleView(course.id)}>
                    {course.topicIds.length} topics
                  </TableCell>
                  <TableCell onClick={() => handleView(course.id)}>
                    <Badge className="bg-success/10 text-success border-success/20">
                      Miễn phí
                    </Badge>
                  </TableCell>
                  <TableCell onClick={() => handleView(course.id)}>
                    <Badge
                      className={
                        course.status === 'Published'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-muted text-muted-foreground'
                      }
                      variant="outline"
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(course.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCourse(course)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CourseFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        course={editingCourse}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingCourse}
        onOpenChange={(open) => !open && setDeletingCourse(undefined)}
        title="Xóa khóa học"
        description="Bạn có chắc chắn muốn xóa khóa học này? Tất cả các chủ đề sẽ được giữ lại nhưng không còn thuộc khóa học nào."
        itemName={deletingCourse?.name || ''}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}