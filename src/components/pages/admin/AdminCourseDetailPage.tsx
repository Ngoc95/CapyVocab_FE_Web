import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Eye, Loader2, RotateCcw } from 'lucide-react';
import { GeneralTopicFormDialog } from '../../admin/GeneralTopicFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';
import { courseService, Course } from '../../../services/courseService';
import { topicService, Topic } from '../../../services/topicService';
import { toast } from 'sonner';

export function AdminCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | undefined>();
  const [deletingTopic, setDeletingTopic] = useState<Topic | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch course and topics
  const fetchData = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch course (includes topics)
      const courseResponse = await courseService.getCourseById(Number(courseId));
      const courseData = courseResponse.metaData;
      setCourse(courseData);

      // Use topics from course response
      if (courseData.topics && courseData.topics.length > 0) {
        // Fetch full topic details for each topic
        const topicPromises = courseData.topics.map((t: any) =>
          topicService.getTopicById(t.id).catch(() => null)
        );
        const topicResponses = await Promise.all(topicPromises);
        const validTopics = topicResponses
          .filter((r): r is any => r !== null)
          .map((r) => r.metaData);
        setTopics(validTopics);
      } else {
        setTopics([]);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu');
      toast.error(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

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
    type?: 'Free' | 'Premium';
    wordIds?: number[];
    courseIds?: number[];
  }) => {
    try {
      if (editingTopic) {
        // Update topic - don't change courseIds, just update topic info
        await topicService.updateTopic(editingTopic.id, topicData);
        toast.success('Cập nhật chủ đề thành công');
      } else {
        // Create new topic and link to this course
        const newTopicData = {
          ...topicData,
          courseIds: courseId ? [Number(courseId)] : undefined,
        };
        await topicService.createTopics([newTopicData]);
        toast.success('Tạo chủ đề thành công');
      }
      setIsFormOpen(false);
      setEditingTopic(undefined);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deleteCompletely: boolean) => {
    if (!deletingTopic) return;

    try {
      setIsDeleting(true);
      if (deleteCompletely) {
        await topicService.deleteTopic(deletingTopic.id);
        toast.success('Xóa chủ đề thành công');
      } else {
        // Remove from course - update course to remove this topic
        if (courseId && course) {
          const currentTopics = course.topics || [];
          const updatedTopics = currentTopics
            .filter((t) => t.id !== deletingTopic.id)
            .map((t, index) => ({ id: t.id, displayOrder: index }));
          
          await courseService.updateCourse(Number(courseId), {
            topics: updatedTopics,
          });
          toast.success('Xóa chủ đề khỏi khóa học thành công');
        }
      }
      setDeletingTopic(undefined);
      fetchData();
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
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục chủ đề');
    }
  };

  const handleView = (topicId: number) => {
    navigate(`/admin/topics/${topicId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || 'Không tìm thấy khóa học'}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/courses')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const totalWords = topics.reduce((sum, t) => sum + (t.words?.length || 0), 0);
  const topicsWithWords = topics.filter((t) => t.words && t.words.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/courses')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách khóa học
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {course.topics?.[0]?.thumbnail ? (
              <img
                src={course.topics[0].thumbnail}
                alt={course.title}
                className="w-20 h-20 rounded-xl object-cover border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
                📚
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground mt-1">{course.description || 'Không có mô tả'}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline">{course.level}</Badge>
                {course.target && (
                  <Badge variant="secondary">{course.target}</Badge>
                )}
                {course.deletedAt ? (
                  <Badge variant="secondary" className="text-muted-foreground">
                    Đã xóa
                  </Badge>
                ) : (
                  <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                    Hoạt động
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chủ đề
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground">Số chủ đề</p>
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

      {/* Topics Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Danh sách chủ đề</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý các chủ đề trong khóa học này
            </p>
          </div>

          {topics.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                📚
              </div>
              <h3 className="font-semibold mb-2">Chưa có chủ đề nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu thêm chủ đề cho khóa học này
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm chủ đề đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chủ đề</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Từ vựng</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topics.map((topic) => (
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
                      <Badge variant="secondary">
                        {topic.words?.length || 0} words
                      </Badge>
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
                ))}
              </TableBody>
            </Table>
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
        description="Bạn muốn xóa chủ đề này khỏi khóa học hay xóa hoàn toàn khỏi hệ thống?"
        itemName={deletingTopic?.title || ''}
        parentName={course.title}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
