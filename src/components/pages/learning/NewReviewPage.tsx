import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Play,
  CheckCircle2,
  Volume2,
  X,
  Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const reviewStats = {
  dueToday: 6,
  totalCards: 487,
  masteredCards: 245,
  learningCards: 189,
  newCards: 53,
};

// Data cho biểu đồ
const levelData = [
  { level: '1', count: 2, fill: '#E9372D' }, // Red
  { level: '2', count: 1, fill: '#FEC107' }, // Yellow
  { level: '3', count: 0, fill: '#0FA9F5' }, // Blue
  { level: '4', count: 3, fill: '#3D47BA' }, // Purple
];

// Mock questions
const mockQuestions = [
  {
    id: 1,
    type: 'term-to-definition',
    term: 'understanding',
    phonetic: '/ˌʌndərˈstændɪŋ/',
    audioUrl: '',
    options: [
      'Sự tốt tự nhiên',
      'Sự tăng trưởng',
      'Thể thức',
      'Đang tin cậy'
    ],
    correctAnswer: 0,
    definition: 'Sự hiểu biết'
  },
  {
    id: 2,
    type: 'definition-to-term',
    definition: 'Sự cố gắng',
    options: [
      'Effort',
      'Success',
      'Failure',
      'Achievement'
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    type: 'true-false-definition',
    term: 'beautiful',
    proposedDefinition: 'Đẹp, xinh đẹp',
    correctAnswer: true
  },
  {
    id: 4,
    type: 'true-false-term',
    definition: 'Nhanh chóng',
    proposedTerm: 'Quickly',
    correctAnswer: true
  },
  {
    id: 5,
    type: 'audio-to-term',
    term: 'understanding',
    phonetic: '/ˌʌndərˈstændɪŋ/',
    audioUrl: '',
    options: [
      'understanding',
      'understandable',
      'understand',
      'understood'
    ],
    correctAnswer: 0
  }
];

export function NewReviewPage() {
  const [isReviewing, setIsReviewing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;
  
  // Check if current answer is correct
  const isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleStartReview = () => {
    setIsReviewing(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (answer: number | boolean) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    // Check if correct
    const isCorrect = answer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Finish review
      setIsReviewing(false);
      setShowCompleteDialog(true);
    }
  };

  const playAudio = () => {
    // Simulate audio playback
    console.log('Playing audio for:', currentQuestion.term);
  };

  if (isReviewing) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Progress Bar */}
        <div className="bg-white border-b px-4 py-3">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Progress value={progress} className="h-3 bg-gray-200" style={{ 
                  ['--progress-background' as string]: '#FCD34D' 
                }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {currentQuestionIndex + 1}/{mockQuestions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl space-y-6">
            {/* Question Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {currentQuestion.type === 'term-to-definition' && 'Từ này có nghĩa là:'}
                  {currentQuestion.type === 'definition-to-term' && 'Chọn từ đúng:'}
                  {currentQuestion.type === 'true-false-definition' && 'Nghĩa này đúng không?'}
                  {currentQuestion.type === 'true-false-term' && 'Từ này đúng không?'}
                  {currentQuestion.type === 'audio-to-term' && 'Nghe và chọn từ đúng:'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Display term or definition */}
                {(currentQuestion.type === 'term-to-definition' || currentQuestion.type === 'true-false-definition') && (
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-bold text-[#1AB1F6]">{currentQuestion.term}</h2>
                    {currentQuestion.phonetic && (
                      <p className="text-muted-foreground">{currentQuestion.phonetic}</p>
                    )}
                  </div>
                )}

                {currentQuestion.type === 'definition-to-term' && (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold">{currentQuestion.definition}</h2>
                  </div>
                )}

                {currentQuestion.type === 'true-false-term' && (
                  <div className="text-center space-y-2">
                    <p className="text-xl text-muted-foreground">{currentQuestion.definition}</p>
                    <h2 className="text-4xl font-bold text-[#1AB1F6]">{currentQuestion.proposedTerm}</h2>
                  </div>
                )}

                {currentQuestion.type === 'true-false-definition' && (
                  <div className="text-center">
                    <p className="text-2xl">{currentQuestion.proposedDefinition}</p>
                  </div>
                )}

                {currentQuestion.type === 'audio-to-term' && (
                  <div className="text-center">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      onClick={playAudio}
                      className="w-20 h-20 rounded-full"
                    >
                      <Volume2 className="w-8 h-8" />
                    </Button>
                  </div>
                )}

                {/* Options for multiple choice */}
                {(currentQuestion.type === 'term-to-definition' || 
                  currentQuestion.type === 'definition-to-term' || 
                  currentQuestion.type === 'audio-to-term') && (
                  <div className="grid gap-3">
                    {currentQuestion.options?.map((option: string, index: number) => {
                      const isSelected = selectedAnswer === index;
                      const isCorrect = index === currentQuestion.correctAnswer;
                      const showCorrect = showResult && isCorrect;
                      const showWrong = showResult && isSelected && !isCorrect;

                      return (
                        <button
                          key={index}
                          onClick={() => !showResult && handleAnswer(index)}
                          disabled={showResult}
                          className={`p-4 border-2 rounded-xl text-left transition-all ${
                            showCorrect ? 'border-green-500 bg-green-50' :
                            showWrong ? 'border-red-500 bg-red-50' :
                            isSelected ? 'border-[#1AB1F6] bg-blue-50' :
                            'border-gray-200 hover:border-[#1AB1F6] hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option}</span>
                            {showCorrect && <Check className="w-5 h-5 text-green-500" />}
                            {showWrong && <X className="w-5 h-5 text-red-500" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* True/False buttons */}
                {(currentQuestion.type === 'true-false-definition' || 
                  currentQuestion.type === 'true-false-term') && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => !showResult && handleAnswer(true)}
                      disabled={showResult}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        showResult && currentQuestion.correctAnswer === true ? 'border-green-500 bg-green-50' :
                        showResult && selectedAnswer === true && currentQuestion.correctAnswer !== true ? 'border-red-500 bg-red-50' :
                        selectedAnswer === true ? 'border-[#1AB1F6] bg-blue-50' :
                        'border-gray-200 hover:border-[#1AB1F6] hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-6 h-6" />
                        <span className="font-medium">Đúng</span>
                      </div>
                    </button>
                    <button
                      onClick={() => !showResult && handleAnswer(false)}
                      disabled={showResult}
                      className={`p-6 border-2 rounded-xl transition-all ${
                        showResult && currentQuestion.correctAnswer === false ? 'border-green-500 bg-green-50' :
                        showResult && selectedAnswer === false && currentQuestion.correctAnswer !== false ? 'border-red-500 bg-red-50' :
                        selectedAnswer === false ? 'border-[#1AB1F6] bg-blue-50' :
                        'border-gray-200 hover:border-[#1AB1F6] hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-6 h-6" />
                        <span className="font-medium">Sai</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Next button */}
                {showResult && (
                  <Button 
                    onClick={handleNext} 
                    className="w-full bg-[#1AB1F6] hover:bg-[#1599d6]"
                    size="lg"
                  >
                    Tiếp tục
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Vocabulary Card */}
            {showResult && (currentQuestion.type === 'term-to-definition' || currentQuestion.type === 'audio-to-term') && (
              <Card className={`border-0 text-white ${isAnswerCorrect ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold">{currentQuestion.term}</h3>
                        <button 
                          onClick={playAudio}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      </div>
                      <p className={`mb-3 ${isAnswerCorrect ? 'text-green-100' : 'text-red-100'}`}>{currentQuestion.phonetic}</p>
                      <p className="text-lg">{currentQuestion.definition}</p>
                      <p className={`text-sm mt-2 ${isAnswerCorrect ? 'text-green-100' : 'text-red-100'}`}>
                        {currentQuestion.options?.[currentQuestion.correctAnswer as number]}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Complete Dialog */}
      {showCompleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#1AB1F6] to-[#00d4ff] rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Hoàn tất ôn tập!</h2>
                <p className="text-muted-foreground">
                  Bạn đã ôn tập thành công <span className="font-semibold text-[#1AB1F6]">{mockQuestions.length} từ</span>
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số câu đúng:</span>
                  <span className="font-bold text-green-600">{score}/{mockQuestions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tỷ lệ chính xác:</span>
                  <span className="font-bold text-[#1AB1F6]">{Math.round((score / mockQuestions.length) * 100)}%</span>
                </div>
              </div>
              <Button 
                size="lg" 
                onClick={() => setShowCompleteDialog(false)}
                className="w-full bg-gradient-to-r from-[#1AB1F6] to-[#00d4ff] hover:from-[#1599d6] hover:to-[#00bfe6] shadow-lg shadow-blue-200"
              >
                Hoàn tất
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <h1>Ôn tập</h1>
        <p className="text-muted-foreground">
          Hệ thống ôn tập thông minh giúp bạn ghi nhớ từ vựng lâu hơn
        </p>
      </div>

      {/* Review Ready Card */}
      <Card className="border-2 border-[#1AB1F6]/20 bg-gradient-to-r from-blue-50 to-cyan-50">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1AB1F6] to-[#00d4ff] rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Sẵn sàng ôn tập</h3>
                <p className="text-muted-foreground mt-1">
                  <span className="font-semibold text-[#1AB1F6]">{reviewStats.dueToday} từ</span> đang chờ bạn ôn tập hôm nay
                </p>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={handleStartReview}
              className="bg-gradient-to-r from-[#1AB1F6] to-[#00d4ff] hover:from-[#1599d6] hover:to-[#00bfe6] px-10 shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              Ôn tập ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Statistics Chart */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-gray-700">
            <span className="text-4xl font-extrabold text-[#1AB1F6]">{reviewStats.dueToday}</span>{' '}
            <span className="text-xl font-semibold">từ đã học chia theo cấp độ</span>
          </CardTitle>
          <CardDescription className="text-base mt-3">
            Thống kê từ vựng theo độ thành thạo của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={levelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis 
                dataKey="level" 
                stroke="#6b7280" 
                fontSize={14}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={14}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar 
                dataKey="count" 
                radius={[16, 16, 0, 0]}
                minPointSize={5}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}