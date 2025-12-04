import { useState } from 'react';
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
import { Search, Plus, Edit, Trash2, Volume2, ImageIcon } from 'lucide-react';
import { useAdminStore } from '../../../utils/adminStore';
import { GeneralWordFormDialog } from '../../admin/GeneralWordFormDialog';
import { DeleteConfirmDialog } from '../../admin/DeleteConfirmDialog';

export function AdminVocabularyPage() {
  const { words, topics, getTopicById, addWord, updateWord, deleteWord } =
    useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<any>(undefined);
  const [deletingWord, setDeletingWord] = useState<any>(undefined);

  const filteredVocabulary = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic === 'all' || word.topicId === filterTopic;
    return matchesSearch && matchesTopic;
  });

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
      deleteWord(deletingWord.id);
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
              <p className="text-2xl font-bold">{words.length}</p>
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
            <Select value={filterTopic} onValueChange={setFilterTopic}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
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
                {filteredVocabulary.map((word) => {
                  const topic = word.topicId ? getTopicById(word.topicId) : null;
                  return (
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
                        <Badge variant="outline" className="capitalize">
                          {word.partOfSpeech}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {topic ? (
                          <Badge variant="outline">{topic.name}</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-muted-foreground">
                            Chưa gán
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {word.example}
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
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
        description="Bạn có chắc chắn muốn xóa từ vựng này khỏi hệ thống?"
        itemName={`${deletingWord?.word} - ${deletingWord?.translation}`}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}