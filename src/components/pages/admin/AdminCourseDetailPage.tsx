import { useState } from 'react';
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
import { ArrowLeft, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAdminStore } from '../../../utils/adminStore';
import { TopicFormDialog } from '../../admin/TopicFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';

export function AdminCourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    getCourseById,
    getTopicsByCourse,
    addTopic,
    updateTopic,
    deleteTopic,
    removeTopicFromCourse,
  } = useAdminStore();

  const course = getCourseById(courseId!);
  const topics = getTopicsByCourse(courseId!);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(undefined);
  const [deletingTopic, setDeletingTopic] = useState<any>(undefined);

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy khóa học</p>
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

  const handleAdd = () => {
    setEditingTopic(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (topic: any) => {
    setEditingTopic(topic);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (topicData: any) => {
    if (editingTopic) {
      updateTopic(editingTopic.id, topicData);
    } else {
      addTopic(topicData);
    }
  };

  const handleDelete = (deleteCompletely: boolean) => {
    if (deletingTopic) {
      if (deleteCompletely) {
        deleteTopic(deletingTopic.id);
      } else {
        removeTopicFromCourse(deletingTopic.id, courseId!);
      }
    }
  };

  const handleView = (topicId: string) => {
    navigate(`/admin/topics/${topicId}`);
  };

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
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
              {course.thumbnail || '📚'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{course.name}</h1>
              <p className="text-muted-foreground mt-1">{course.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline">{course.level}</Badge>
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
            <div className="text-2xl font-bold">
              {topics.reduce((sum, t) => sum + t.wordIds.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng từ vựng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {topics.filter((t) => t.wordIds.length > 0).length}
            </div>
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
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                          {topic.thumbnail || '📖'}
                        </div>
                        <div>
                          <div className="font-medium">{topic.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {topic.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={() => handleView(topic.id)}>
                      <Badge variant="secondary">
                        {topic.wordIds.length} words
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingTopic(topic)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TopicFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        topic={editingTopic}
        courseId={courseId!}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingTopic}
        onOpenChange={(open) => !open && setDeletingTopic(undefined)}
        title="Xóa chủ đề"
        description="Bạn muốn xóa chủ đề này khỏi khóa học hay xóa hoàn toàn khỏi hệ thống?"
        itemName={deletingTopic?.name || ''}
        parentName={course.name}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
