import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { 
  ArrowLeft, 
  Volume2, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const mockFlashcards = [
  {
    id: 1,
    word: 'Hello',
    phonetic: '/həˈloʊ/',
    translation: 'Xin chào',
    example: 'Hello! How are you today?',
    exampleTranslation: 'Xin chào! Hôm nay bạn thế nào?',
  },
  {
    id: 2,
    word: 'Thank you',
    phonetic: '/θæŋk juː/',
    translation: 'Cảm ơn',
    example: 'Thank you for your help!',
    exampleTranslation: 'Cảm ơn bạn đã giúp đỡ!',
  },
  {
    id: 3,
    word: 'Please',
    phonetic: '/pliːz/',
    translation: 'Làm ơn',
    example: 'Please pass me the salt.',
    exampleTranslation: 'Làm ơn đưa tôi lọ muối.',
  },
  {
    id: 4,
    word: 'Excuse me',
    phonetic: '/ɪkˈskjuːz miː/',
    translation: 'Xin lỗi',
    example: 'Excuse me, where is the restroom?',
    exampleTranslation: 'Xin lỗi, nhà vệ sinh ở đâu?',
  },
  {
    id: 5,
    word: 'Goodbye',
    phonetic: '/ɡʊdˈbaɪ/',
    translation: 'Tạm biệt',
    example: 'Goodbye! See you tomorrow.',
    exampleTranslation: 'Tạm biệt! Hẹn gặp lại vào ngày mai.',
  },
];

export function FlashcardsPage() {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentCard = mockFlashcards[currentIndex];
  const progress = ((knownCards.length + unknownCards.length) / mockFlashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (!isComplete) {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleKnown = () => {
    if (!knownCards.includes(currentCard.id) && !unknownCards.includes(currentCard.id)) {
      setKnownCards([...knownCards, currentCard.id]);
    }
    handleNext();
  };

  const handleUnknown = () => {
    if (!knownCards.includes(currentCard.id) && !unknownCards.includes(currentCard.id)) {
      setUnknownCards([...unknownCards, currentCard.id]);
    }
    handleNext();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setUnknownCards([]);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-success" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Great Job!</h1>
            <p className="text-muted-foreground">
              You've completed all flashcards in this set
            </p>
          </div>
          
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Known</span>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span className="font-medium">{knownCards.length} cards</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Need Practice</span>
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-destructive" />
                  <span className="font-medium">{unknownCards.length} cards</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-medium">{mockFlashcards.length} cards</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Link to={`/vocabulary/${id}`}>
              <Button variant="outline">
                Back to Vocabulary
              </Button>
            </Link>
            <Button onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
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
          {currentIndex + 1} / {mockFlashcards.length}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Check className="w-4 h-4 text-success" />
              <span>{knownCards.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <X className="w-4 h-4 text-destructive" />
              <span>{unknownCards.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex items-center justify-center py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div
              className="relative w-full h-[400px] cursor-pointer perspective-1000"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <motion.div
                className="absolute inset-0"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <Card 
                  className="absolute inset-0 backface-hidden border-2 hover:shadow-xl transition-shadow"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-bold">{currentCard.word}</h2>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-xl text-muted-foreground">{currentCard.phonetic}</p>
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <Volume2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to see translation
                    </p>
                  </CardContent>
                </Card>

                {/* Back */}
                <Card 
                  className="absolute inset-0 backface-hidden border-2 hover:shadow-xl transition-shadow bg-primary text-primary-foreground"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <CardContent className="h-full flex flex-col items-center justify-center p-8 space-y-6">
                    <div className="text-center space-y-4">
                      <h2 className="text-5xl font-bold">{currentCard.translation}</h2>
                      <div className="space-y-2 mt-6">
                        <p className="text-lg italic opacity-90">{currentCard.example}</p>
                        <p className="text-base opacity-75">{currentCard.exampleTranslation}</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-75">
                      Click to see word
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Know/Don't Know Buttons */}
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              className="flex-1 h-14 border-destructive/30 hover:bg-destructive/10"
              onClick={handleUnknown}
            >
              <X className="w-5 h-5 mr-2 text-destructive" />
              Need Practice
            </Button>
            <Button
              className="flex-1 h-14 bg-success hover:bg-success/90"
              onClick={handleKnown}
            >
              <Check className="w-5 h-5 mr-2" />
              I Know This
            </Button>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
