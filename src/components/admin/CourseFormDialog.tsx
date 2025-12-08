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
import { Course, CourseLevel } from '../../services/courseService';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSubmit: (course: {
    title: string;
    level: CourseLevel;
    target?: string;
    description?: string;
    topics?: Array<{ id: number; displayOrder: number }>;
  }) => void;
}

export function CourseFormDialog({
  open,
  onOpenChange,
  course,
  onSubmit,
}: CourseFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<CourseLevel>('Beginner');
  const [target, setTarget] = useState('');

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description || '');
      setLevel(course.level);
      setTarget(course.target || '');
    } else {
      setTitle('');
      setDescription('');
      setLevel('Beginner');
      setTarget('');
    }
  }, [course, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      level,
      description: description || undefined,
      target: target || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {course ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
          </DialogTitle>
          <DialogDescription>
            {course
              ? 'Cập nhật thông tin khóa học'
              : 'Tạo khóa học mới cho học viên'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tên khóa học *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: IELTS Foundation"
                required
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả chi tiết về khóa học..."
                rows={3}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Đối tượng</Label>
              <Input
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Ví dụ: Beginner learners"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Cấp độ *</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as CourseLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advance">Advance</SelectItem>
                </SelectContent>
              </Select>
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
              {course ? 'Cập nhật' : 'Thêm khóa học'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
