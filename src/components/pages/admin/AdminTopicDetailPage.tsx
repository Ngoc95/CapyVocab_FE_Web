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
import { ArrowLeft, Plus, Edit, Trash2, Volume2, Loader2, RotateCcw } from 'lucide-react';
import { GeneralWordFormDialog } from '../../admin/GeneralWordFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';
import { topicService, Topic, TopicWordsResponse } from '../../../services/topicService';
import { wordService, Word } from '../../../services/wordService';
import { toast } from 'sonner';

export function AdminTopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | undefined>();
  const [deletingWord, setDeletingWord] = useState<Word | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch topic and words
  const fetchData = async () => {
    if (!topicId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch topic
      const topicResponse = await topicService.getTopicById(Number(topicId));
      setTopic(topicResponse.metaData);

      // Fetch words of topic
      try {
        const wordsResponse = await topicService.getTopicWords(Number(topicId), { limit: 1000 });
        setWords(wordsResponse.metaData.words.map((w: any) => ({
          id: w.id,
          content: w.content,
          pronunciation: w.pronunciation || '',
          meaning: w.meaning || '',
          position: (w.position || 'Others') as Word['position'],
          audio: w.audio,
          image: w.image,
          example: w.example,
          translateExample: w.translateExample,
        })));
      } catch (err) {
        // Fallback: get topic words from topic response
        const topicWords = topicResponse.metaData.words || [];
        setWords(topicWords.map((w: any) => ({
          id: w.id,
          content: w.content,
          pronunciation: w.pronunciation || '',
          meaning: w.meaning || '',
          position: (w.position || 'Others') as Word['position'],
          audio: w.audio,
          image: w.image,
          example: w.example,
          translateExample: w.translateExample,
        })));
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
  }, [topicId]);

  const handleAdd = () => {
    setEditingWord(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (wordData: {
    content: string;
    pronunciation: string;
    meaning: string;
    position?: 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Others';
    audio?: string;
    image?: string;
    example?: string;
    translateExample?: string;
    topicIds?: number[];
  }) => {
    try {
      if (editingWord) {
        // Update word and ensure it's linked to this topic
        const updatedData = {
          ...wordData,
          topicIds: topicId ? [Number(topicId)] : undefined,
        };
        await wordService.updateWord(editingWord.id, updatedData);
        toast.success('Cập nhật từ vựng thành công');
      } else {
        // Create new word and link to this topic
        const newWordData = {
          ...wordData,
          topicIds: topicId ? [Number(topicId)] : undefined,
        };
        await wordService.createWords([newWordData]);
        toast.success('Tạo từ vựng thành công');
      }
      setIsFormOpen(false);
      setEditingWord(undefined);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deleteCompletely: boolean) => {
    if (!deletingWord) return;

    try {
      setIsDeleting(true);
      if (deleteCompletely) {
        await wordService.deleteWord(deletingWord.id);
        toast.success('Xóa từ vựng thành công');
      } else {
        // Remove from topic - update topic to remove this word
        if (topicId && topic) {
          const currentWordIds = topic.words?.map((w) => w.id) || [];
          const updatedWordIds = currentWordIds.filter((id) => id !== deletingWord.id);
          
          await topicService.updateTopic(Number(topicId), {
            wordIds: updatedWordIds,
          });
          toast.success('Xóa từ vựng khỏi chủ đề thành công');
        }
      }
      setDeletingWord(undefined);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi xóa từ vựng');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (word: Word) => {
    try {
      await wordService.restoreWord(word.id);
      toast.success('Khôi phục từ vựng thành công');
      fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục từ vựng');
    }
  };

  const handleBack = () => {
    if (topic?.courses && topic.courses.length > 0) {
      navigate(`/admin/courses/${topic.courses[0].id}`);
    } else {
      navigate('/admin/topics');
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl && audioUrl !== 'N/A') {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error('Error playing audio:', err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error || 'Không tìm thấy chủ đề'}</p>
          <Button
            variant="outline"
            onClick={() => navigate('/admin/topics')}
            className="mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const wordsByPosition = words.reduce((acc, w) => {
    acc[w.position] = (acc[w.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={handleBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại {topic.courses && topic.courses.length > 0 ? topic.courses[0].title : 'danh sách'}
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {topic.thumbnail && topic.thumbnail !== 'N/A' ? (
              <img
                src={topic.thumbnail}
                alt={topic.title}
                className="w-20 h-20 rounded-xl object-cover border"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl';
                    fallback.textContent = '📖';
                    parent.insertBefore(fallback, e.currentTarget);
                  }
                }}
              />
            ) : (
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center text-4xl">
                📖
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{topic.title}</h1>
              <p className="text-muted-foreground mt-1">{topic.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge
                  variant={topic.type === 'Premium' ? 'default' : 'outline'}
                  className={topic.type === 'Premium' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : ''}
                >
                  {topic.type}
                </Badge>
                {topic.courses && topic.courses.length > 0 && (
                  <Badge variant="outline">
                    {topic.courses[0].title}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm từ vựng
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{words.length}</div>
            <p className="text-xs text-muted-foreground">Tổng từ vựng</p>
          </CardContent>
        </Card>
        {['Noun', 'Verb', 'Adjective', 'Adverb'].map((pos) => (
          <Card key={pos}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{wordsByPosition[pos] || 0}</div>
              <p className="text-xs text-muted-foreground">{pos}</p>
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
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {words.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {word.image && word.image !== 'N/A' && (
                          <div className="relative w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                            <img
                              src={word.image}
                              alt={word.content}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        {word.audio && word.audio !== 'N/A' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => playAudio(word.audio)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{word.content}</div>
                        <div className="text-sm text-muted-foreground">
                          {word.pronunciation}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{word.meaning}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {word.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {word.example && word.example !== 'N/A' && (
                          <>
                            <div className="text-sm truncate">{word.example}</div>
                            {word.translateExample && word.translateExample !== 'N/A' && (
                              <div className="text-xs text-muted-foreground truncate">
                                {word.translateExample}
                              </div>
                            )}
                          </>
                        )}
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
                        {word.deletedAt ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRestore(word)}
                            title="Khôi phục"
                          >
                            <RotateCcw className="w-4 h-4 text-green-500" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingWord(word)}
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

      <GeneralWordFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        word={editingWord}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmDialog
        open={!!deletingWord}
        onOpenChange={(open) => !open && setDeletingWord(undefined)}
        title="Xóa từ vựng"
        description="Bạn muốn xóa từ vựng này khỏi chủ đề hay xóa hoàn toàn khỏi hệ thống?"
        itemName={`${deletingWord?.content} - ${deletingWord?.meaning}`}
        parentName={topic.title}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
