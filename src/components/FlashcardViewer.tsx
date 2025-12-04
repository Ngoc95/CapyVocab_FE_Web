import { useState } from "react";
import { Flashcard } from "../types";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onComplete?: () => void;
}

export function FlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];
  const isLastCard = currentIndex === flashcards.length - 1;

  const handleNext = () => {
    if (isLastCard) {
      onComplete?.();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-slate-600">
          Thẻ {currentIndex + 1} / {flashcards.length}
        </p>
        <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className="perspective-1000 cursor-pointer mb-6"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative"
        >
          <Card className="min-h-[400px] flex items-center justify-center p-8">
            <CardContent className="text-center" style={{ backfaceVisibility: 'hidden' }}>
              {!isFlipped ? (
                <div>
                  <p className="text-sm text-slate-500 mb-4">Mặt trước</p>
                  <h2 className="mb-4">{currentCard.front}</h2>
                  <p className="text-slate-400 text-sm">Nhấn để lật thẻ</p>
                </div>
              ) : (
                <div style={{ transform: 'rotateY(180deg)' }}>
                  <p className="text-sm text-slate-500 mb-4">Mặt sau</p>
                  <h2 className="mb-4 text-blue-600">{currentCard.back}</h2>
                  {currentCard.example && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Ví dụ:</p>
                      <p className="italic">{currentCard.example}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Trước
        </Button>

        <Button
          variant="outline"
          onClick={() => setIsFlipped(false)}
          disabled={!isFlipped}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Đặt lại
        </Button>

        <Button onClick={handleNext}>
          {isLastCard ? "Hoàn thành" : "Tiếp"}
          {!isLastCard && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
