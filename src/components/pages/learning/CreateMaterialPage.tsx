import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Checkbox } from '../../ui/checkbox';
import { Separator } from '../../ui/separator';
import { toast } from 'sonner';
import type { Flashcard, QuizQuestion } from '../../../types';

export function CreateMaterialPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [isPublic, setIsPublic] = useState(true);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề học liệu');
      return;
    }

    if (flashcards.length === 0 && quizzes.length === 0) {
      toast.error('Vui lòng tạo ít nhất một flashcard hoặc quiz');
      return;
    }

    // Generate code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    toast.success(`Đã tạo học liệu với mã: ${code}`);
    navigate('/materials');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/materials')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1>Tạo học liệu mới</h1>
            <p className="text-muted-foreground">
              Tạo bộ flashcard và quiz của riêng bạn
            </p>
          </div>
          <Button onClick={handleSave} size="lg">
            Lưu học liệu
          </Button>
        </div>

        {/* Basic Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề học liệu *</Label>
              <Input
                id="title"
                placeholder="VD: Từ vựng IELTS Band 7+"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
              <Textarea
                id="description"
                placeholder="Mô tả ngắn về học liệu của bạn..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá tiền (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Nhập 0 nếu miễn phí
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="public">Công khai</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    id="public"
                    checked={isPublic}
                    onCheckedChange={setIsPublic}
                  />
                  <span className="text-sm">
                    {isPublic ? 'Mọi người có thể xem' : 'Chỉ mình tôi'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Nội dung học liệu</CardTitle>
            <CardDescription>
              Thêm flashcard và quiz cho học liệu của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="flashcards" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flashcards">
                  Flashcard ({flashcards.length})
                </TabsTrigger>
                <TabsTrigger value="quizzes">
                  Quiz ({quizzes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="flashcards" className="space-y-4 mt-4">
                <FlashcardEditor
                  flashcards={flashcards}
                  setFlashcards={setFlashcards}
                />
              </TabsContent>

              <TabsContent value="quizzes" className="space-y-4 mt-4">
                <QuizEditor quizzes={quizzes} setQuizzes={setQuizzes} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface FlashcardEditorProps {
  flashcards: Flashcard[];
  setFlashcards: (flashcards: Flashcard[]) => void;
}

function FlashcardEditor({ flashcards, setFlashcards }: FlashcardEditorProps) {
  const addFlashcard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      term: '',
      definition: '',
    };
    setFlashcards([...flashcards, newCard]);
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(
      flashcards.map((card) =>
        card.id === id ? { ...card, ...updates } : card
      )
    );
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  return (
    <div className="space-y-4">
      {flashcards.map((card, index) => (
        <Card key={card.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Thẻ #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteFlashcard(card.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Từ vựng (Mặt trước) *</Label>
              <Input
                placeholder="VD: Academic"
                value={card.term}
                onChange={(e) =>
                  updateFlashcard(card.id, { term: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh mặt trước (Tùy chọn)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Kéo thả hoặc click để tải ảnh lên
                </p>
                <Button variant="outline" size="sm">
                  Chọn ảnh
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Định nghĩa (Mặt sau) *</Label>
              <Textarea
                placeholder="VD: Thuộc về học thuật"
                rows={3}
                value={card.definition}
                onChange={(e) =>
                  updateFlashcard(card.id, { definition: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Hình ảnh mặt sau (Tùy chọn)</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Kéo thả hoặc click để tải ảnh lên
                </p>
                <Button variant="outline" size="sm">
                  Chọn ảnh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addFlashcard} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Thêm flashcard
      </Button>
    </div>
  );
}

interface QuizEditorProps {
  quizzes: QuizQuestion[];
  setQuizzes: (quizzes: QuizQuestion[]) => void;
}

function QuizEditor({ quizzes, setQuizzes }: QuizEditorProps) {
  const addQuiz = () => {
    const newQuiz: QuizQuestion = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      question: '',
      answerMode: 'single',
      options: ['', '', '', ''],
      correctAnswers: [],
      timeLimit: 30,
    };
    setQuizzes([...quizzes, newQuiz]);
  };

  const updateQuiz = (id: string, updates: Partial<QuizQuestion>) => {
    setQuizzes(
      quizzes.map((quiz) => (quiz.id === id ? { ...quiz, ...updates } : quiz))
    );
  };

  const deleteQuiz = (id: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
  };

  const updateOption = (quizId: string, index: number, value: string) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (quiz && quiz.options) {
      const newOptions = [...quiz.options];
      newOptions[index] = value;
      updateQuiz(quizId, { options: newOptions });
    }
  };

  const toggleCorrectAnswer = (quizId: string, index: number) => {
    const quiz = quizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    if (quiz.answerMode === 'single') {
      updateQuiz(quizId, { correctAnswers: [index] });
    } else {
      const current = quiz.correctAnswers || [];
      const newAnswers = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];
      updateQuiz(quizId, { correctAnswers: newAnswers });
    }
  };

  return (
    <div className="space-y-4">
      {quizzes.map((quiz, index) => (
        <Card key={quiz.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Câu hỏi #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteQuiz(quiz.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Loại câu hỏi</Label>
              <Select
                value={quiz.type}
                onValueChange={(value: 'multiple-choice' | 'fill-in') =>
                  updateQuiz(quiz.id, { type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Chọn đáp án</SelectItem>
                  <SelectItem value="fill-in">Điền từ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nội dung câu hỏi *</Label>
              <Textarea
                placeholder="Nhập câu hỏi của bạn..."
                rows={3}
                value={quiz.question}
                onChange={(e) =>
                  updateQuiz(quiz.id, { question: e.target.value })
                }
              />
            </div>

            {quiz.type === 'multiple-choice' ? (
              <>
                <div className="space-y-2">
                  <Label>Chế độ trả lời</Label>
                  <RadioGroup
                    value={quiz.answerMode}
                    onValueChange={(value: 'single' | 'multiple') =>
                      updateQuiz(quiz.id, {
                        answerMode: value,
                        correctAnswers: [],
                      })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id={`single-${quiz.id}`} />
                      <Label htmlFor={`single-${quiz.id}`}>
                        Một đáp án đúng
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="multiple"
                        id={`multiple-${quiz.id}`}
                      />
                      <Label htmlFor={`multiple-${quiz.id}`}>
                        Nhiều đáp án đúng
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Các phương án trả lời</Label>
                  {quiz.options?.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center gap-3"
                    >
                      {quiz.answerMode === 'single' ? (
                        <RadioGroup
                          value={
                            quiz.correctAnswers?.[0]?.toString() || ''
                          }
                          onValueChange={() =>
                            toggleCorrectAnswer(quiz.id, optionIndex)
                          }
                        >
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`option-${quiz.id}-${optionIndex}`}
                          />
                        </RadioGroup>
                      ) : (
                        <Checkbox
                          checked={quiz.correctAnswers?.includes(
                            optionIndex
                          )}
                          onCheckedChange={() =>
                            toggleCorrectAnswer(quiz.id, optionIndex)
                          }
                        />
                      )}
                      <Label className="text-sm font-medium">
                        {String.fromCharCode(65 + optionIndex)}.
                      </Label>
                      <Input
                        placeholder={`Phương án ${String.fromCharCode(
                          65 + optionIndex
                        )}`}
                        value={option}
                        onChange={(e) =>
                          updateOption(quiz.id, optionIndex, e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Đáp án đúng *</Label>
                <Input
                  placeholder="Nhập đáp án đúng..."
                  value={quiz.correctAnswer || ''}
                  onChange={(e) =>
                    updateQuiz(quiz.id, { correctAnswer: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Giải thích đáp án (Tùy chọn)</Label>
              <Textarea
                placeholder="Giải thích tại sao đây là đáp án đúng..."
                rows={2}
                value={quiz.explanation || ''}
                onChange={(e) =>
                  updateQuiz(quiz.id, { explanation: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Thời gian trả lời</Label>
              <Select
                value={String(quiz.timeLimit || 0)}
                onValueChange={(value) =>
                  updateQuiz(quiz.id, {
                    timeLimit: parseInt(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Không giới hạn</SelectItem>
                  <SelectItem value="5">5 giây</SelectItem>
                  <SelectItem value="10">10 giây</SelectItem>
                  <SelectItem value="20">20 giây</SelectItem>
                  <SelectItem value="30">30 giây</SelectItem>
                  <SelectItem value="45">45 giây</SelectItem>
                  <SelectItem value="60">1 phút</SelectItem>
                  <SelectItem value="90">1.5 phút</SelectItem>
                  <SelectItem value="120">2 phút</SelectItem>
                  <SelectItem value="180">3 phút</SelectItem>
                  <SelectItem value="300">5 phút</SelectItem>
                  <SelectItem value="600">10 phút</SelectItem>
                  <SelectItem value="900">15 phút</SelectItem>
                  <SelectItem value="1200">20 phút</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={addQuiz} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Thêm câu hỏi
      </Button>
    </div>
  );
}
