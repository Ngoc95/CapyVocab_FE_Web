import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { ArrowLeft, Check, X, Award, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

const mockQuizQuestions = [
  {
    id: 1,
    question: 'What is the meaning of "Hello"?',
    options: ['Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi'],
    correctAnswer: 0,
  },
  {
    id: 2,
    question: 'Choose the correct translation for "Thank you"',
    options: ['Làm ơn', 'Cảm ơn', 'Xin lỗi', 'Tạm biệt'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'What does "Please" mean in Vietnamese?',
    options: ['Xin chào', 'Tạm biệt', 'Làm ơn', 'Cảm ơn'],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'Select the correct meaning of "Goodbye"',
    options: ['Xin chào', 'Cảm ơn', 'Xin lỗi', 'Tạm biệt'],
    correctAnswer: 3,
  },
  {
    id: 5,
    question: '"Excuse me" translates to:',
    options: ['Tạm biệt', 'Xin lỗi', 'Làm ơn', 'Xin chào'],
    correctAnswer: 1,
  },
];

export function QuizPage() {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(mockQuizQuestions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const question = mockQuizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / mockQuizQuestions.length) * 100;

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setShowResult(false);

      if (currentQuestion < mockQuizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsComplete(true);
      }
    }
  };

  const handleCheckAnswer = () => {
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(mockQuizQuestions.length).fill(null));
    setShowResult(false);
    setIsComplete(false);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === mockQuizQuestions[index].correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: mockQuizQuestions.length,
      percentage: Math.round((correct / mockQuizQuestions.length) * 100),
    };
  };

  if (isComplete) {
    const score = calculateScore();
    
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center ${
              score.percentage >= 80
                ? 'bg-success/10'
                : score.percentage >= 60
                ? 'bg-warning/10'
                : 'bg-destructive/10'
            }`}
          >
            <Award
              className={`w-16 h-16 ${
                score.percentage >= 80
                  ? 'text-success'
                  : score.percentage >= 60
                  ? 'text-warning'
                  : 'text-destructive'
              }`}
            />
          </motion.div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Quiz Complete!</h1>
            <p className="text-muted-foreground">
              {score.percentage >= 80
                ? 'Excellent work! Keep it up!'
                : score.percentage >= 60
                ? 'Good job! A bit more practice will help.'
                : 'Keep practicing! You\'ll improve with time.'}
            </p>
          </div>

          <Card className="w-full max-w-md">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary">{score.percentage}%</p>
                <p className="text-muted-foreground mt-2">Your Score</p>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Correct Answers</span>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    <span className="font-medium">{score.correct}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Wrong Answers</span>
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-destructive" />
                    <span className="font-medium">{score.total - score.correct}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-medium">Total Questions</span>
                  <span className="font-medium">{score.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link to={`/vocabulary/${id}`}>
              <Button variant="outline">Back to Vocabulary</Button>
            </Link>
            <Button onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to={`/vocabulary/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <Badge variant="outline">
          Question {currentQuestion + 1} / {mockQuizQuestions.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground text-right">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-2">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Question {currentQuestion + 1}</p>
              <h2 className="text-2xl font-semibold">{question.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => !showResult && handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-success bg-success/10'
                        : showWrong
                        ? 'border-destructive bg-destructive/10'
                        : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-accent'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            showCorrect
                              ? 'border-success bg-success text-white'
                              : showWrong
                              ? 'border-destructive bg-destructive text-white'
                              : isSelected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-muted-foreground/30'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </span>
                      {showCorrect && <Check className="w-5 h-5 text-success" />}
                      {showWrong && <X className="w-5 h-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-destructive/10 border border-destructive/20'
                }`}
              >
                <p
                  className={`font-medium ${
                    selectedAnswer === question.correctAnswer ? 'text-success' : 'text-destructive'
                  }`}
                >
                  {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedAnswer === question.correctAnswer
                    ? 'Great job! You got it right.'
                    : `The correct answer is: ${question.options[question.correctAnswer]}`}
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {!showResult ? (
          <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
            Check Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestion < mockQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Button>
        )}
      </div>
    </div>
  );
}
