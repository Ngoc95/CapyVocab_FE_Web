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
import { Topic, TopicType } from '../../services/topicService';
import { courseService, Course } from '../../services/courseService';

interface GeneralTopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: Topic;
  onSubmit: (topic: {
    title: string;
    description: string;
    thumbnail?: string;
    type?: TopicType;
    wordIds?: number[];
    courseIds?: number[];
  }) => void;
}

export function GeneralTopicFormDialog({
  open,
  onOpenChange,
  topic,
  onSubmit,
}: GeneralTopicFormDialogProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [type, setType] = useState<TopicType>('Free');
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);

  // Fetch courses
  useEffect(() => {
    if (open) {
      courseService.getCourses({ limit: 1000 })
        .then((response) => {
          setCourses(response.metaData.courses);
        })
        .catch((err) => {
          console.error('Error fetching courses:', err);
        });
    }
  }, [open]);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setDescription(topic.description);
      setThumbnail(topic.thumbnail || '');
      setType(topic.type);
      setSelectedCourseIds(topic.courses?.map(c => c.id) || []);
    } else {
      setTitle('');
      setDescription('');
      setThumbnail('');
      setType('Free');
      setSelectedCourseIds([]);
    }
  }, [topic, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      thumbnail: thumbnail || undefined,
      type,
      courseIds: selectedCourseIds.length > 0 ? selectedCourseIds : undefined,
    });
    onOpenChange(false);
  };

  const toggleCourse = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="title">Tên chủ đề *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Greetings & Introductions"
                required
                maxLength={255}
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
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Loại chủ đề</Label>
              <Select value={type} onValueChange={(v) => setType(v as TopicType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Khóa học (có thể chọn nhiều)</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Đang tải...</p>
                ) : (
                  <div className="space-y-2">
                    {courses.map((course) => (
                      <label
                        key={course.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(course.id)}
                          onChange={() => toggleCourse(course.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{course.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail (URL hoặc emoji)</Label>
              <Input
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Ví dụ: 👋 hoặc https://example.com/thumbnail.jpg"
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
