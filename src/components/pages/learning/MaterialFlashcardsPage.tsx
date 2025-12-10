import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { motion, AnimatePresence } from 'motion/react';

import { exerciseService } from '../../../services/exerciseService';
const mockFlashcards: any[] = [];

export function MaterialFlashcardsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState<string[]>([]);
  const [cards, setCards] = useState<any[]>(mockFlashcards);

  useEffect(() => {
    const folderId = Number(id);
    if (!folderId) return;
    exerciseService.getFolderById(folderId)
      .then((res) => {
        const server = res.metaData;
        const fc = (server.flashCards || []).map((c: any, idx: number) => ({
          id: String(c.id ?? idx),
          term: c.frontContent || '',
          definition: c.backContent || '',
        }));
        if (fc.length) setCards(fc);
      })
      .catch(() => {});
  }, [id]);

  const currentCard = cards[currentIndex];
  const progress = cards.length ? (((currentIndex + 1) / cards.length) * 100) : 0;

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      if (!completedCards.includes(currentCard.id)) {
        setCompletedCards([...completedCards, currentCard.id]);
      }
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Completed all cards
      navigate(`/materials/${id}`);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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
            <h2 className="font-semibold">Thẻ ghi nhớ</h2>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} / {cards.length || 0}
            </p>
          </div>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Progress */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="mb-8">
          <div
            className="relative h-[400px] cursor-pointer"
            onClick={handleFlip}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped ? 'back' : 'front'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Card className="h-full shadow-lg">
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4">
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        {isFlipped ? 'Mặt sau' : 'Mặt trước'}
                      </span>
                    </div>
                    <p className="text-3xl font-semibold mb-6">
                      {isFlipped ? currentCard.definition : currentCard.term}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RotateCw className="w-4 h-4" />
                      <span>Click để lật thẻ</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Trước
          </Button>
          <Button variant="outline" size="lg" onClick={handleFlip}>
            <RotateCw className="w-4 h-4 mr-2" />
            Lật thẻ
          </Button>
          <Button
            size="lg"
            onClick={handleNext}
            disabled={currentIndex === cards.length}
          >
            {currentIndex === mockFlashcards.length - 1 ? 'Hoàn thành' : 'Tiếp'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
