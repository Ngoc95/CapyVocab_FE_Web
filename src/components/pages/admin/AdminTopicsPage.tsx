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
import { GeneralTopicFormDialog } from '../../admin/GeneralTopicFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';

export function AdminTopicsPage() {
  const navigate = useNavigate();
  const { topics, courses, getCourseById, addTopic, updateTopic, deleteTopic } =
    useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(undefined);
  const [deletingTopic, setDeletingTopic] = useState<any>(undefined);

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCourse =
      courseFilter === 'all' || topic.courseId === courseFilter;
    return matchesSearch && matchesCourse;
  });

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
      deleteTopic(deletingTopic.id);
    }
  };

  const handleView = (topicId: string) => {
    navigate(`/admin/topics/${topicId}`);
  };

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
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground">Tổng chủ đề</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {topics.filter((t) => t.courseId).length}
            </div>
            <p className="text-xs text-muted-foreground">Đã gán khóa học</p>
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
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Khóa học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khóa học</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
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
                <TableHead>Chủ đề</TableHead>
                <TableHead>Khóa học</TableHead>
                <TableHead>Số từ vựng</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTopics.map((topic) => {
                const course = topic.courseId
                  ? getCourseById(topic.courseId)
                  : null;
                return (
                  <TableRow
                    key={topic.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    <TableCell onClick={() => handleView(topic.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
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
                      {course ? (
                        <Badge variant="outline">{course.name}</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground">
                          Chưa gán
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell onClick={() => handleView(topic.id)}>
                      {topic.wordIds.length} words
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
                );
              })}
            </TableBody>
          </Table>
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
        description="Bạn có chắc chắn muốn xóa chủ đề này? Các từ vựng sẽ được giữ lại nhưng không còn thuộc chủ đề nào."
        itemName={deletingTopic?.name || ''}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}