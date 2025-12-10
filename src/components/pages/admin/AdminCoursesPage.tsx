import { useState, useEffect } from 'react';
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
import { Search, Plus, Edit, Trash2, Eye, RotateCcw, Loader2 } from 'lucide-react';
import { CourseFormDialog } from '../../admin/CourseFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';
import { courseService, Course, CourseListParams, CourseLevel } from '../../../services/courseService';
import { toast } from 'sonner';

export function AdminCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCourses, setTotalCourses] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [deletingCourse, setDeletingCourse] = useState<Course | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: CourseListParams = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
      };

      if (searchQuery) {
        params.title = searchQuery;
      }

      if (levelFilter !== 'all') {
        params.level = levelFilter as CourseLevel;
      }

      const response = await courseService.getCourses(params);
      setCourses(response.metaData.courses);
      setTotalCourses(response.metaData.total);
      setCurrentPage(response.metaData.currentPage);
      setTotalPages(response.metaData.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khóa học');
      toast.error(err.message || 'Có lỗi xảy ra khi tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, sortBy, levelFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchCourses();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = () => {
    setEditingCourse(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (courseData: {
    title: string;
    level: CourseLevel;
    target?: string;
    description?: string;
    topics?: Array<{ id: number; displayOrder: number }>;
  }) => {
    try {
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, courseData);
        toast.success('Cập nhật khóa học thành công');
      } else {
        await courseService.createCourses([courseData]);
        toast.success('Tạo khóa học thành công');
      }
      setIsFormOpen(false);
      setEditingCourse(undefined);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deleteCompletely: boolean) => {
    if (!deletingCourse) return;

    try {
      setIsDeleting(true);
      await courseService.deleteCourse(deletingCourse.id);
      toast.success('Xóa khóa học thành công');
      setDeletingCourse(undefined);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi xóa khóa học');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (course: Course) => {
    try {
      await courseService.restoreCourse(course.id);
      toast.success('Khôi phục khóa học thành công');
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục khóa học');
    }
  };

  const handleView = (courseId: number) => {
    navigate(`/admin/courses/${courseId}`);
  };

  const totalTopics = courses.reduce((sum, c) => sum + (c.totalTopic || 0), 0);

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
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">Tổng khóa học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {courses.filter((c) => !c.deletedAt).length}
            </div>
            <p className="text-xs text-muted-foreground">Đang hoạt động</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTopics}</div>
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
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advance">Advance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID (Tăng dần)</SelectItem>
                <SelectItem value="-id">ID (Giảm dần)</SelectItem>
                <SelectItem value="title">Tên (A-Z)</SelectItem>
                <SelectItem value="-title">Tên (Z-A)</SelectItem>
                <SelectItem value="level">Cấp độ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <>
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
                  {courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Không tìm thấy khóa học nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((course) => (
                      <TableRow key={course.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell onClick={() => handleView(course.id)}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                              📚
                            </div>
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-muted-foreground">{course.description || 'Không có mô tả'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handleView(course.id)}>
                          <Badge variant="outline">{course.level}</Badge>
                        </TableCell>
                        <TableCell onClick={() => handleView(course.id)}>
                          {course.totalTopic || 0} topics
                        </TableCell>
                        <TableCell onClick={() => handleView(course.id)}>
                          <Badge className="bg-success/10 text-success border-success/20">
                            Miễn phí
                          </Badge>
                        </TableCell>
                        <TableCell onClick={() => handleView(course.id)}>
                          {course.deletedAt ? (
                            <Badge variant="secondary" className="text-muted-foreground">
                              Đã xóa
                            </Badge>
                          ) : (
                            <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                              Hoạt động
                            </Badge>
                          )}
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
                            {course.deletedAt ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRestore(course)}
                                title="Khôi phục"
                              >
                                <RotateCcw className="w-4 h-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingCourse(course)}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} ({totalCourses} khóa học)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
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
        description="Bạn có chắc chắn muốn xóa khóa học này? Đây là soft delete, bạn có thể khôi phục sau."
        itemName={deletingCourse?.title || ''}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
