import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { toast } from 'sonner';
import { exerciseService } from '../../../services/exerciseService';

// Mock data
const mockQuiz = [
  {
    id: 'q1',
    type: 'multiple-choice' as const,
    question: 'What is the capital of Vietnam?',
    answerMode: 'single' as const,
    options: ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hue'],
    correctAnswers: [0],
    explanation: 'Hanoi is the capital city of Vietnam.',
    timeLimit: 30,
  },
  {
    id: 'q2',
    type: 'multiple-choice' as const,
    question: 'Which of the following are programming languages?',
    answerMode: 'multiple' as const,
    options: ['JavaScript', 'HTML', 'Python', 'CSS'],
    correctAnswers: [0, 2],
    explanation: 'JavaScript and Python are programming languages. HTML and CSS are markup/styling languages.',
    timeLimit: 45,
  },
  {
    id: 'q3',
    type: 'fill-in' as const,
    question: 'Complete the sentence: The _____ is the largest ocean in the world.',
    correctAnswer: 'Pacific',
    explanation: 'The Pacific Ocean is the largest ocean on Earth.',
    timeLimit: 20,
  },
];

export function MaterialQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: any }>({});
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mockQuiz[0].timeLimit);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState<any[]>(mockQuiz);

  useEffect(() => {
    const folderId = Number(id);
    if (!folderId) return;
    exerciseService.getFolderById(folderId)
      .then((res) => {
        const server = res.metaData;
        const qz = (server.quizzes || []).flatMap((q: any) => q.question || []);
        if (qz.length) {
          const mapped = qz.map((q: any, idx: number) => {
            const options = q.options || [];
            const correctStrings = q.correctAnswers || [];
            const correctIndexes = correctStrings
              .map((ans: string) => options.indexOf(ans))
              .filter((i: number) => i >= 0);
            return {
              id: `q-${idx}`,
              type: q.type === 'fill-in' ? 'fill-in' : 'multiple-choice',
              question: q.question,
              answerMode: correctIndexes.length <= 1 ? 'single' : 'multiple',
              options,
              correctAnswers: q.type === 'fill-in' ? [] : correctIndexes,
              correctAnswer: q.type === 'fill-in' ? (correctStrings[0] || '') : undefined,
              explanation: q.explanation,
              timeLimit: q.time || 30,
            };
          });
          setQuestions(mapped);
          setTimeLeft(mapped[0].timeLimit || 30);
        }
      })
      .catch(() => {});
  }, [id]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleMultipleChoiceSingle = (value: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: parseInt(value),
    });
  };

  const handleMultipleChoiceMultiple = (optionIndex: number) => {
    const current = (userAnswers[currentIndex] as number[]) || [];
    const newAnswers = current.includes(optionIndex)
      ? current.filter((i) => i !== optionIndex)
      : [...current, optionIndex];
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: newAnswers,
    });
  };

  const handleFillIn = (value: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: value,
    });
  };

  const checkAnswer = () => {
    const userAnswer = userAnswers[currentIndex];
    const question = currentQuestion;

    if (question.type === 'multiple-choice') {
      if (question.answerMode === 'single') {
        return userAnswer === question.correctAnswers![0];
      } else {
        const correctSet = new Set(question.correctAnswers);
        const userSet = new Set(userAnswer || []);
        return (
          correctSet.size === userSet.size &&
          [...correctSet].every((x) => userSet.has(x))
        );
      }
    } else {
      // fill-in
      return (
        userAnswer?.toLowerCase().trim() ===
        question.correctAnswer?.toLowerCase().trim()
      );
    }
  };

  const handleSubmit = () => {
    if (userAnswers[currentIndex] === undefined) {
      toast.error('Vui lòng chọn hoặc nhập câu trả lời');
      return;
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
      setTimeLeft(currentQuestion?.time || 30);
    } else {
      setQuizCompleted(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      const userAnswer = userAnswers[index];
      if (q.type === 'multiple-choice') {
        if ((q as any).answerMode === 'single') {
          if (userAnswer === q.correctAnswers?.[0]) correct++;
        } else {
          const correctSet = new Set(q.correctAnswers || []);
          const userSet = new Set(userAnswer || []);
          if (
            correctSet.size === userSet.size &&
            [...correctSet].every((x) => userSet.has(x))
          ) {
            correct++;
          }
        }
      } else {
        if (
          userAnswer?.toLowerCase().trim() ===
          (q.correctAnswer || '').toLowerCase().trim()
        ) {
          correct++;
        }
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-3xl">Hoàn thành!</CardTitle>
              <CardDescription>Kết quả bài kiểm tra của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {score}%
                </div>
                <p className="text-muted-foreground">
                  Bạn trả lời đúng {Math.round((score / 100) * mockQuiz.length)}/
                  {mockQuiz.length} câu hỏi
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/materials/${id}`)}
                >
                  Quay lại
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setCurrentIndex(0);
                    setUserAnswers({});
                    setShowResult(false);
                    setQuizCompleted(false);
                    setTimeLeft(mockQuiz[0].timeLimit);
                  }}
                >
                  Làm lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isCorrect = showResult && checkAnswer();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/materials/${id}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h2 className="font-semibold">Làm test</h2>
            <p className="text-sm text-muted-foreground">
              Câu {currentIndex + 1} / {mockQuiz.length}
            </p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            {timeLeft}s
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.type === 'multiple-choice' &&
                  currentQuestion.answerMode === 'multiple' && (
                    <CardDescription>
                      Chọn tất cả các đáp án đúng
                    </CardDescription>
                  )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'multiple-choice' ? (
              <>
                {currentQuestion.answerMode === 'single' ? (
                  <RadioGroup
                    value={userAnswers[currentIndex]?.toString() || ''}
                    onValueChange={handleMultipleChoiceSingle}
                    disabled={showResult}
                  >
                    {currentQuestion.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border ${
                          showResult
                            ? currentQuestion.correctAnswers?.includes(index)
                              ? 'border-success bg-success/5'
                              : userAnswers[currentIndex] === index
                              ? 'border-destructive bg-destructive/5'
                              : ''
                            : 'hover:bg-accent'
                        }`}
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`option-${index}`}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Label>
                        {showResult &&
                          currentQuestion.correctAnswers?.includes(index) && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                        {showResult &&
                          !currentQuestion.correctAnswers?.includes(index) &&
                          userAnswers[currentIndex] === index && (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {currentQuestion.options?.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-lg border ${
                          showResult
                            ? currentQuestion.correctAnswers?.includes(index)
                              ? 'border-success bg-success/5'
                              : (userAnswers[currentIndex] || []).includes(index)
                              ? 'border-destructive bg-destructive/5'
                              : ''
                            : 'hover:bg-accent'
                        }`}
                      >
                        <Checkbox
                          id={`option-${index}`}
                          checked={(userAnswers[currentIndex] || []).includes(
                            index
                          )}
                          onCheckedChange={() =>
                            handleMultipleChoiceMultiple(index)
                          }
                          disabled={showResult}
                        />
                        <Label
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          {option}
                        </Label>
                        {showResult &&
                          currentQuestion.correctAnswers?.includes(index) && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                        {showResult &&
                          !currentQuestion.correctAnswers?.includes(index) &&
                          (userAnswers[currentIndex] || []).includes(index) && (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <Label>Câu trả lời của bạn</Label>
                <Input
                  placeholder="Nhập câu trả lời..."
                  value={userAnswers[currentIndex] || ''}
                  onChange={(e) => handleFillIn(e.target.value)}
                  disabled={showResult}
                />
                {showResult && (
                  <p className="text-sm text-muted-foreground">
                    Đáp án đúng: <span className="font-semibold">{currentQuestion.correctAnswer}</span>
                  </p>
                )}
              </div>
            )}

            {/* Explanation */}
            {showResult && currentQuestion.explanation && (
              <div
                className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-success/10' : 'bg-muted'
                }`}
              >
                <p className="font-semibold mb-2 flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {!showResult ? (
            <Button onClick={handleSubmit} className="flex-1" size="lg">
              Kiểm tra
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1" size="lg">
              {currentIndex === mockQuiz.length - 1
                ? 'Xem kết quả'
                : 'Câu tiếp theo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
