import { useState } from "react";
import { Quiz } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizViewerProps {
  quizzes: Quiz[];
  onComplete?: (score: number) => void;
}

export function QuizViewer({ quizzes, onComplete }: QuizViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizzes[currentIndex];
  const isLastQuiz = currentIndex === quizzes.length - 1;

  const handleSelectAnswer = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    if (selectedAnswer === currentQuiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuiz) {
      onComplete?.(score + (selectedAnswer === currentQuiz.correctAnswer ? 1 : 0));
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-slate-600">
          Câu hỏi {currentIndex + 1} / {quizzes.length}
        </p>
        <p className="text-blue-600">
          Điểm: {score} / {quizzes.length}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuiz.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {currentQuiz.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuiz.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrect
                      ? "border-green-500 bg-green-50"
                      : showWrong
                      ? "border-red-500 bg-red-50"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {showWrong && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!showResult ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                Kiểm tra
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {isLastQuiz ? "Hoàn thành" : "Câu tiếp theo"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
