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
import { AdminTopic } from '../../utils/adminStore';

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: AdminTopic;
  courseId: string;
  onSubmit: (topic: {
    name: string;
    description: string;
    thumbnail?: string;
    courseId: string;
  }) => void;
}

export function TopicFormDialog({
  open,
  onOpenChange,
  topic,
  courseId,
  onSubmit,
}: TopicFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (topic) {
      setName(topic.name);
      setDescription(topic.description);
      setThumbnail(topic.thumbnail || '');
    } else {
      setName('');
      setDescription('');
      setThumbnail('');
    }
  }, [topic, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      thumbnail: thumbnail || undefined,
      courseId,
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
              : 'Tạo chủ đề mới cho khóa học này'}
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
