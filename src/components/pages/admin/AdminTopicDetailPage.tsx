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
import { ArrowLeft, Plus, Edit, Trash2, Volume2 } from 'lucide-react';
import { useAdminStore } from '../../../utils/adminStore';
import { WordFormDialog } from '../../admin/WordFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';

const levelColors = {
  1: '#E9372D',
  2: '#FEC107',
  3: '#0FA9F5',
  4: '#3D47BA',
};

const levelNames = {
  1: 'Cơ bản',
  2: 'Trung bình',
  3: 'Nâng cao',
  4: 'Chuyên sâu',
};

export function AdminTopicDetailPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const {
    getTopicById,
    getCourseById,
    getWordsByTopic,
    addWord,
    updateWord,
    deleteWord,
    removeWordFromTopic,
  } = useAdminStore();

  const topic = getTopicById(topicId!);
  const course = topic?.courseId ? getCourseById(topic.courseId) : null;
  const words = getWordsByTopic(topicId!);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<any>(undefined);
  const [deletingWord, setDeletingWord] = useState<any>(undefined);

  if (!topic) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy chủ đề</p>
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
    setEditingWord(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (word: any) => {
    setEditingWord(word);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (wordData: any) => {
    if (editingWord) {
      updateWord(editingWord.id, wordData);
    } else {
      addWord(wordData);
    }
  };

  const handleDelete = (deleteCompletely: boolean) => {
    if (deletingWord) {
      if (deleteCompletely) {
        deleteWord(deletingWord.id);
      } else {
        removeWordFromTopic(deletingWord.id, topicId!);
      }
    }
  };

  const handleBack = () => {
    if (course) {
      navigate(`/admin/courses/${course.id}`);
    } else {
      navigate('/admin/courses');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại {course ? course.name : 'danh sách'}
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
              {topic.thumbnail || '📖'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{topic.name}</h1>
              <p className="text-muted-foreground mt-1">{topic.description}</p>
              {course && (
                <Badge variant="outline" className="mt-3">
                  {course.name}
                </Badge>
              )}
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm từ vựng
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{words.length}</div>
            <p className="text-xs text-muted-foreground">Tổng từ vựng</p>
          </CardContent>
        </Card>
        {[1, 2, 3, 4].map((level) => (
          <Card key={level}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: levelColors[level as 1 | 2 | 3 | 4] }}
                />
                <div className="text-2xl font-bold">
                  {words.filter((w) => w.level === level).length}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Cấp độ {level} - {levelNames[level as 1 | 2 | 3 | 4]}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Words Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Danh sách từ vựng</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý các từ vựng trong chủ đề này
            </p>
          </div>

          {words.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                📝
              </div>
              <h3 className="font-semibold mb-2">Chưa có từ vựng nào</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Bắt đầu thêm từ vựng cho chủ đề này
              </p>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm từ vựng đầu tiên
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Media</TableHead>
                  <TableHead>Từ vựng</TableHead>
                  <TableHead>Dịch nghĩa</TableHead>
                  <TableHead>Loại từ</TableHead>
                  <TableHead>Ví dụ</TableHead>
                  <TableHead>Cấp độ</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {word.image && (
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={word.image}
                              alt={word.word}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const icon = document.createElement('div');
                                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                                  parent.appendChild(icon);
                                }
                              }}
                            />
                          </div>
                        )}
                        {word.audioUrl && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => {
                              const audio = new Audio(word.audioUrl);
                              audio.play().catch(err => console.error('Error playing audio:', err));
                            }}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{word.word}</div>
                        <div className="text-sm text-muted-foreground">
                          {word.phonetic}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{word.translation}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{word.partOfSpeech}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="text-sm truncate">{word.example}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {word.exampleTranslation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: levelColors[word.level] }}
                        />
                        <span className="text-sm">Cấp {word.level}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(word)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingWord(word)}
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

      <WordFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        word={editingWord}
        topicId={topicId!}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingWord}
        onOpenChange={(open) => !open && setDeletingWord(undefined)}
        title="Xóa từ vựng"
        description="Bạn muốn xóa từ vựng này khỏi chủ đề hay xóa hoàn toàn khỏi hệ thống?"
        itemName={`${deletingWord?.word} - ${deletingWord?.translation}`}
        parentName={topic.name}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}