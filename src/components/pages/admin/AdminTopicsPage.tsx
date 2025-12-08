import React, { useState, useEffect } from 'react';
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
import { GeneralTopicFormDialog } from '../../admin/GeneralTopicFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';
import { topicService, Topic, TopicListParams, TopicType } from '../../../services/topicService';
import { courseService, Course } from '../../../services/courseService';
import { toast } from 'sonner';

export function AdminTopicsPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTopics, setTotalTopics] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | undefined>();
  const [deletingTopic, setDeletingTopic] = useState<Topic | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch courses for filter
  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses({ limit: 1000 });
      setCourses(response.metaData.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  // Fetch topics
  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: TopicListParams = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
      };

      if (searchQuery) {
        params.title = searchQuery;
      }

      if (typeFilter !== 'all') {
        params.type = typeFilter as TopicType;
      }

      const response = await topicService.getTopics(params);
      setTopics(response.metaData.topics);
      setTotalTopics(response.metaData.total);
      setCurrentPage(response.metaData.currentPage);
      setTotalPages(response.metaData.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách chủ đề');
      toast.error(err.message || 'Có lỗi xảy ra khi tải danh sách chủ đề');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    fetchTopics();
  }, [currentPage, sortBy, typeFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchTopics();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAdd = () => {
    setEditingTopic(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (topicData: {
    title: string;
    description: string;
    thumbnail?: string;
    type?: TopicType;
    wordIds?: number[];
    courseIds?: number[];
  }) => {
    try {
      if (editingTopic) {
        await topicService.updateTopic(editingTopic.id, topicData);
        toast.success('Cập nhật chủ đề thành công');
      } else {
        await topicService.createTopics([topicData]);
        toast.success('Tạo chủ đề thành công');
      }
      setIsFormOpen(false);
      setEditingTopic(undefined);
      fetchTopics();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deleteCompletely: boolean) => {
    if (!deletingTopic) return;

    try {
      setIsDeleting(true);
      await topicService.deleteTopic(deletingTopic.id);
      toast.success('Xóa chủ đề thành công');
      setDeletingTopic(undefined);
      fetchTopics();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi xóa chủ đề');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (topic: Topic) => {
    try {
      await topicService.restoreTopic(topic.id);
      toast.success('Khôi phục chủ đề thành công');
      fetchTopics();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục chủ đề');
    }
  };

  const handleView = (topicId: number) => {
    navigate(`/admin/topics/${topicId}`);
  };

  const topicsWithCourses = topics.filter((t) => t.courses && t.courses.length > 0).length;
  const topicsWithWords = topics.filter((t) => t.words && t.words.length > 0).length;
  const totalWords = topics.reduce((sum, t) => sum + (t.words?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Chủ đề</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý các chủ đề từ vựng trong khóa học
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm chủ đề
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalTopics}</div>
            <p className="text-xs text-muted-foreground">Tổng chủ đề</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{topicsWithCourses}</div>
            <p className="text-xs text-muted-foreground">Đã gán khóa học</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalWords}</div>
            <p className="text-xs text-muted-foreground">Tổng từ vựng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{topicsWithWords}</div>
            <p className="text-xs text-muted-foreground">Chủ đề có nội dung</p>
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
                  placeholder="Tìm kiếm chủ đề..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
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
                <SelectItem value="type">Loại</SelectItem>
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
                    <TableHead>Chủ đề</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Khóa học</TableHead>
                    <TableHead>Số từ vựng</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Không tìm thấy chủ đề nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    topics.map((topic) => (
                      <TableRow
                        key={topic.id}
                        className="cursor-pointer hover:bg-muted/50"
                      >
                        <TableCell onClick={() => handleView(topic.id)}>
                          <div className="flex items-center gap-3">
                            {topic.thumbnail && topic.thumbnail !== 'N/A' ? (
                              <img
                                src={topic.thumbnail}
                                alt={topic.title}
                                className="w-12 h-12 rounded-xl object-cover border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    const fallback = document.createElement('div');
                                    fallback.className = 'w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl';
                                    fallback.textContent = '📖';
                                    parent.insertBefore(fallback, e.currentTarget);
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
                                📖
                              </div>
                            )}
                            <div>
                              <div className="font-medium">{topic.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {topic.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handleView(topic.id)}>
                          <Badge
                            variant={topic.type === 'Premium' ? 'default' : 'outline'}
                            className={topic.type === 'Premium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : ''}
                          >
                            {topic.type}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={() => handleView(topic.id)}>
                          {topic.courses && topic.courses.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {topic.courses.slice(0, 2).map((course) => (
                                <Badge key={course.id} variant="outline">
                                  {course.title}
                                </Badge>
                              ))}
                              {topic.courses.length > 2 && (
                                <Badge variant="secondary">
                                  +{topic.courses.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <Badge variant="secondary" className="text-muted-foreground">
                              Chưa gán
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell onClick={() => handleView(topic.id)}>
                          {topic.words?.length || 0} words
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(topic.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(topic)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {topic.deletedAt ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRestore(topic)}
                                title="Khôi phục"
                              >
                                <RotateCcw className="w-4 h-4 text-green-500" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingTopic(topic)}
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
                    Trang {currentPage} / {totalPages} ({totalTopics} chủ đề)
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

      <GeneralTopicFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        topic={editingTopic}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingTopic}
        onOpenChange={(open) => !open && setDeletingTopic(undefined)}
        title="Xóa chủ đề"
        description="Bạn có chắc chắn muốn xóa chủ đề này? Đây là soft delete, bạn có thể khôi phục sau."
        itemName={deletingTopic?.title || ''}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
