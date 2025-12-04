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
import { AdminWord } from '../../utils/adminStore';

interface WordFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word?: AdminWord;
  topicId: string;
  onSubmit: (word: {
    word: string;
    phonetic: string;
    translation: string;
    partOfSpeech: string;
    example: string;
    exampleTranslation: string;
    level: 1 | 2 | 3 | 4;
    topicId: string;
    image?: string;
    audioUrl?: string;
  }) => void;
}

const levelColors = {
  1: '#E9372D',
  2: '#FEC107',
  3: '#0FA9F5',
  4: '#3D47BA',
};

export function WordFormDialog({
  open,
  onOpenChange,
  word,
  topicId,
  onSubmit,
}: WordFormDialogProps) {
  const [wordText, setWordText] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [translation, setTranslation] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('noun');
  const [example, setExample] = useState('');
  const [exampleTranslation, setExampleTranslation] = useState('');
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [image, setImage] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    if (word) {
      setWordText(word.word);
      setPhonetic(word.phonetic);
      setTranslation(word.translation);
      setPartOfSpeech(word.partOfSpeech);
      setExample(word.example);
      setExampleTranslation(word.exampleTranslation);
      setLevel(word.level);
      setImage(word.image || '');
      setAudioUrl(word.audioUrl || '');
    } else {
      setWordText('');
      setPhonetic('');
      setTranslation('');
      setPartOfSpeech('noun');
      setExample('');
      setExampleTranslation('');
      setLevel(1);
      setImage('');
      setAudioUrl('');
    }
  }, [word, open]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      // Check file size (max 5MB)
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
      // Check if file is audio
      if (!file.type.startsWith('audio/')) {
        alert('Vui lòng chọn file âm thanh');
        return;
      }
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      word: wordText,
      phonetic,
      translation,
      partOfSpeech,
      example,
      exampleTranslation,
      level,
      topicId,
      image: image || undefined,
      audioUrl: audioUrl || undefined,
    });
    onOpenChange(false);
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
              : 'Tạo từ vựng mới cho chủ đề này'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="word">Từ vựng *</Label>
                <Input
                  id="word"
                  value={wordText}
                  onChange={(e) => setWordText(e.target.value)}
                  placeholder="Ví dụ: Hello"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phonetic">Phiên âm *</Label>
                <Input
                  id="phonetic"
                  value={phonetic}
                  onChange={(e) => setPhonetic(e.target.value)}
                  placeholder="Ví dụ: /həˈloʊ/"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="translation">Dịch nghĩa *</Label>
              <Input
                id="translation"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="Ví dụ: Xin chào"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partOfSpeech">Loại từ *</Label>
                <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noun">Noun (Danh từ)</SelectItem>
                    <SelectItem value="verb">Verb (Động từ)</SelectItem>
                    <SelectItem value="adjective">Adjective (Tính từ)</SelectItem>
                    <SelectItem value="adverb">Adverb (Trạng từ)</SelectItem>
                    <SelectItem value="pronoun">Pronoun (Đại từ)</SelectItem>
                    <SelectItem value="preposition">Preposition (Giới từ)</SelectItem>
                    <SelectItem value="conjunction">Conjunction (Liên từ)</SelectItem>
                    <SelectItem value="interjection">Interjection (Thán từ)</SelectItem>
                    <SelectItem value="phrase">Phrase (Cụm từ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Cấp độ *</Label>
                <Select
                  value={String(level)}
                  onValueChange={(v) => setLevel(Number(v) as 1 | 2 | 3 | 4)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((l) => (
                      <SelectItem key={l} value={String(l)}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: levelColors[l as 1 | 2 | 3 | 4] }}
                          />
                          Cấp độ {l}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="example">Ví dụ *</Label>
              <Textarea
                id="example"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Ví dụ: Hello! How are you?"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exampleTranslation">Dịch ví dụ *</Label>
              <Textarea
                id="exampleTranslation"
                value={exampleTranslation}
                onChange={(e) => setExampleTranslation(e.target.value)}
                placeholder="Ví dụ: Xin chào! Bạn khỏe không?"
                rows={2}
                required
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
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
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
              {audioUrl && (
                <div className="mt-2">
                  <audio controls className="w-full h-10">
                    <source src={audioUrl} />
                    Trình duyệr không hỗ trợ audio.
                  </audio>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAudioUrl('')}
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