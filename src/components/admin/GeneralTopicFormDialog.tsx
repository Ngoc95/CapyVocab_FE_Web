import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { AdminTopic, useAdminStore } from '../../utils/adminStore';

interface GeneralTopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: AdminTopic;
  onSubmit: (topic: {
    name: string;
    description: string;
    thumbnail?: string;
    courseId: string;
  }) => void;
}

export function GeneralTopicFormDialog({
  open,
  onOpenChange,
  topic,
  onSubmit,
}: GeneralTopicFormDialogProps) {
  const { courses } = useAdminStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
      setThumbnail(topic.thumbnail || '');
      setCourseId(topic.courseId || 'none');
    } else {
      setName('');
      setDescription('');
      setThumbnail('');
      setCourseId('none');
    }
  }, [topic, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      thumbnail: thumbnail || undefined,
      courseId: courseId === 'none' ? '' : courseId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {topic ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
          </DialogTitle>
          <DialogDescription>
            {topic
              ? 'Cập nhật thông tin chủ đề'
              : 'Tạo chủ đề mới (có thể chưa gán vào khóa học)'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên chủ đề *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Greetings & Introductions"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về chủ đề..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId">Khóa học</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khóa học (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Chưa gán khóa học</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (emoji)</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Ví dụ: 👋"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {topic ? 'Cập nhật' : 'Thêm chủ đề'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}