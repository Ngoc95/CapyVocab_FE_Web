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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Word, WordPosition } from '../../services/wordService';
import { topicService, Topic } from '../../services/topicService';

interface GeneralWordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word?: Word;
  onSubmit: (word: {
    content: string;
    pronunciation: string;
    meaning: string;
    position?: WordPosition;
    audio?: string;
    image?: string;
    example?: string;
    translateExample?: string;
    topicIds?: number[];
  }) => void;
}

export function GeneralWordFormDialog({
  open,
  onOpenChange,
  word,
  onSubmit,
}: GeneralWordFormDialogProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [content, setContent] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [meaning, setMeaning] = useState('');
  const [position, setPosition] = useState<WordPosition>('Others');
  const [example, setExample] = useState('');
  const [translateExample, setTranslateExample] = useState('');
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [image, setImage] = useState('');
  const [audio, setAudio] = useState('');

  // Fetch topics
  useEffect(() => {
    if (open) {
      topicService.getTopics({ limit: 1000 })
        .then((response) => {
          setTopics(response.metaData.topics);
        })
        .catch((err) => {
          console.error('Error fetching topics:', err);
        });
    }
  }, [open]);

  useEffect(() => {
    if (word) {
      setContent(word.content);
      setPronunciation(word.pronunciation);
      setMeaning(word.meaning);
      setPosition(word.position);
      setExample(word.example || '');
      setTranslateExample(word.translateExample || '');
      setSelectedTopicIds(word.topics?.map(t => t.id) || []);
      setImage(word.image || '');
      setAudio(word.audio || '');
    } else {
      setContent('');
      setPronunciation('');
      setMeaning('');
      setPosition('Others');
      setExample('');
      setTranslateExample('');
      setSelectedTopicIds([]);
      setImage('');
      setAudio('');
    }
  }, [word, open]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        alert('Vui lòng chọn file âm thanh');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudio(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      content,
      pronunciation,
      meaning,
      position,
      example: example || undefined,
      translateExample: translateExample || undefined,
      image: image || undefined,
      audio: audio || undefined,
      topicIds: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
    });
    onOpenChange(false);
  };

  const toggleTopic = (topicId: number) => {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {word ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
          </DialogTitle>
          <DialogDescription>
            {word
              ? 'Cập nhật thông tin từ vựng'
              : 'Tạo từ vựng mới (có thể chưa gán vào chủ đề)'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content">Từ vựng *</Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ví dụ: Hello"
                  required
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pronunciation">Phiên âm *</Label>
                <Input
                  id="pronunciation"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  placeholder="Ví dụ: /həˈloʊ/"
                  required
                  maxLength={255}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meaning">Dịch nghĩa *</Label>
              <Input
                id="meaning"
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Ví dụ: Xin chào"
                required
                maxLength={255}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Loại từ</Label>
                <Select value={position} onValueChange={(v) => setPosition(v as WordPosition)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Noun">Noun (Danh từ)</SelectItem>
                    <SelectItem value="Verb">Verb (Động từ)</SelectItem>
                    <SelectItem value="Adjective">Adjective (Tính từ)</SelectItem>
                    <SelectItem value="Adverb">Adverb (Trạng từ)</SelectItem>
                    <SelectItem value="Others">Others (Khác)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chủ đề (có thể chọn nhiều)</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                {topics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Đang tải...</p>
                ) : (
                  <div className="space-y-2">
                    {topics.map((topic) => (
                      <label
                        key={topic.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTopicIds.includes(topic.id)}
                          onChange={() => toggleTopic(topic.id)}
                          className="rounded"
                        />
                        <span className="text-sm">{topic.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Ví dụ</Label>
              <Textarea
                id="example"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Ví dụ: Hello! How are you?"
                rows={2}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="translateExample">Dịch ví dụ</Label>
              <Textarea
                id="translateExample"
                value={translateExample}
                onChange={(e) => setTranslateExample(e.target.value)}
                placeholder="Ví dụ: Xin chào! Bạn khỏe không?"
                rows={2}
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Nhập URL</TabsTrigger>
                  <TabsTrigger value="upload">Tải lên</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </TabsContent>
                <TabsContent value="upload" className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Kích thước tối đa: 5MB
                  </p>
                </TabsContent>
              </Tabs>
              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setImage('')}
                    className="mt-1"
                  >
                    Xóa hình ảnh
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Âm thanh</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Nhập URL</TabsTrigger>
                  <TabsTrigger value="upload">Tải lên</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <Input
                    value={audio}
                    onChange={(e) => setAudio(e.target.value)}
                    placeholder="https://example.com/audio.mp3"
                  />
                </TabsContent>
                <TabsContent value="upload" className="space-y-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Kích thước tối đa: 10MB
                  </p>
                </TabsContent>
              </Tabs>
              {audio && (
                <div className="mt-2">
                  <audio controls className="w-full h-10">
                    <source src={audio} />
                    Trình duyệt không hỗ trợ audio.
                  </audio>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudio('')}
                    className="mt-1"
                  >
                    Xóa âm thanh
                  </Button>
                </div>
              )}
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
              {word ? 'Cập nhật' : 'Thêm từ vựng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
