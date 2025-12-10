import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
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
import { Search, Plus, Edit, Trash2, Volume2, RotateCcw, Loader2 } from 'lucide-react';
import { GeneralWordFormDialog } from '../../admin/GeneralWordFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';
import { wordService, Word, WordListParams, WordPosition } from '../../../services/wordService';
import { topicService, Topic } from '../../../services/topicService';
import { toast } from 'sonner';

export function AdminVocabularyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalWords, setTotalWords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | undefined>();
  const [deletingWord, setDeletingWord] = useState<Word | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch topics for filter
  const fetchTopics = async () => {
    try {
      const response = await topicService.getTopics({ limit: 1000 });
      setTopics(response.metaData.topics);
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  // Fetch words
  const fetchWords = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: WordListParams = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
      };

      if (searchQuery) {
        params.content = searchQuery;
      }

      if (positionFilter !== 'all') {
        params.position = positionFilter as WordPosition;
      }

      const response = await wordService.getWords(params);
      setWords(response.metaData.words);
      setTotalWords(response.metaData.total);
      setCurrentPage(response.metaData.currentPage);
      setTotalPages(response.metaData.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách từ vựng');
      toast.error(err.message || 'Có lỗi xảy ra khi tải danh sách từ vựng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    fetchWords();
  }, [currentPage, sortBy, positionFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchWords();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    position?: WordPosition;
    audio?: string;
    image?: string;
    example?: string;
    translateExample?: string;
    topicIds?: number[];
  }) => {
    try {
      if (editingWord) {
        await wordService.updateWord(editingWord.id, wordData);
        toast.success('Cập nhật từ vựng thành công');
      } else {
        await wordService.createWords([wordData]);
        toast.success('Tạo từ vựng thành công');
      }
      setIsFormOpen(false);
      setEditingWord(undefined);
      fetchWords();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (deleteCompletely: boolean) => {
    if (!deletingWord) return;

    try {
      setIsDeleting(true);
      await wordService.deleteWord(deletingWord.id);
      toast.success('Xóa từ vựng thành công');
      setDeletingWord(undefined);
      fetchWords();
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
      fetchWords();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục từ vựng');
    }
  };

  const playAudio = (audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.error('Error playing audio:', err));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Từ vựng</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả từ vựng trong hệ thống</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm từ vựng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng từ vựng</p>
              <p className="text-2xl font-bold">{totalWords}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách từ vựng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo từ hoặc nghĩa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Loại từ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại từ</SelectItem>
                <SelectItem value="Noun">Noun</SelectItem>
                <SelectItem value="Verb">Verb</SelectItem>
                <SelectItem value="Adjective">Adjective</SelectItem>
                <SelectItem value="Adverb">Adverb</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID (Tăng dần)</SelectItem>
                <SelectItem value="-id">ID (Giảm dần)</SelectItem>
                <SelectItem value="content">Từ (A-Z)</SelectItem>
                <SelectItem value="-content">Từ (Z-A)</SelectItem>
                <SelectItem value="position">Loại từ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Media</TableHead>
                      <TableHead>Từ vựng</TableHead>
                      <TableHead>Dịch nghĩa</TableHead>
                      <TableHead>Loại từ</TableHead>
                      <TableHead>Chủ đề</TableHead>
                      <TableHead>Ví dụ</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {words.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          Không tìm thấy từ vựng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      words.map((word) => (
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
                          <TableCell className="text-sm">
                            {word.topics && word.topics.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {word.topics.slice(0, 2).map((topic) => (
                                  <Badge key={topic.id} variant="outline">
                                    {topic.title}
                                  </Badge>
                                ))}
                                {word.topics.length > 2 && (
                                  <Badge variant="secondary">
                                    +{word.topics.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <Badge variant="secondary" className="text-muted-foreground">
                                Chưa gán
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate">
                              {word.example && word.example !== 'N/A' ? word.example : '-'}
                            </p>
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} ({totalWords} từ vựng)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
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
        description="Bạn có chắc chắn muốn xóa từ vựng này? Đây là soft delete, bạn có thể khôi phục sau."
        itemName={`${deletingWord?.content} - ${deletingWord?.meaning}`}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
