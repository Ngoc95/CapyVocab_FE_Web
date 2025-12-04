import { useState } from "react";
import { useAppStore } from "../../utils/store";
import { calculateNextReview } from "../../utils/mockData";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Brain, CheckCircle, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

export function ReviewPage() {
  const reviewItems = useAppStore((state) => state.reviewItems);
  const updateReviewItem = useAppStore((state) => state.updateReviewItem);
  const getItemsDueForReview = useAppStore((state) => state.getItemsDueForReview);
  const itemsDueForReview = getItemsDueForReview();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  if (itemsDueForReview.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <Brain className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="mb-4">Không có flashcard cần ôn tập</h2>
            <p className="text-slate-600 mb-8">
              Bạn đã hoàn thành tất cả ôn tập hôm nay! Quay lại sau để tiếp tục.
            </p>
            <Button onClick={() => window.location.href = "/my-learning"}>
              Về trang học tập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentIndex >= itemsDueForReview.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="mb-4">Hoàn thành ôn tập!</h2>
            <p className="text-slate-600 mb-2">
              Bạn đã ôn tập <strong>{reviewedCount}</strong> flashcard
            </p>
            <p className="text-sm text-slate-500 mb-8">
              Hệ thống sẽ nhắc bạn ôn tập vào thời điểm phù hợp
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setCurrentIndex(0);
                setReviewedCount(0);
                setIsFlipped(false);
              }}>
                Ôn lại
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/my-learning"}>
                Về trang học tập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentItem = itemsDueForReview[currentIndex];

  const handleQualityRating = (quality: number) => {
    const { nextInterval, nextEaseFactor, nextRepetitions } = calculateNextReview(
      quality,
      currentItem.repetitions,
      currentItem.easeFactor,
      currentItem.interval
    );

    const updatedItem = {
      ...currentItem,
      nextReview: new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1000),
      interval: nextInterval,
      easeFactor: nextEaseFactor,
      repetitions: nextRepetitions,
    };

    updateReviewItem(updatedItem);
    setReviewedCount((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);
    setIsFlipped(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Ôn tập thông minh</h1>
          <p className="text-slate-600">
            Hệ thống Spaced Repetition giúp bạn ghi nhớ lâu hơn
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-600">
            Thẻ {currentIndex + 1} / {itemsDueForReview.length}
          </p>
          <div className="flex-1 mx-4 bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / itemsDueForReview.length) * 100}%` }}
            />
          </div>
          <p className="text-blue-600">
            Đã ôn: {reviewedCount}
          </p>
        </div>

        <div
          className="cursor-pointer mb-6"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative"
          >
            <Card className="min-h-[400px] flex items-center justify-center p-8">
              <CardContent className="text-center w-full" style={{ backfaceVisibility: 'hidden' }}>
                {!isFlipped ? (
                  <div>
                    <p className="text-sm text-slate-500 mb-4">Nhớ nghĩa của từ này?</p>
                    <h2 className="mb-4">{currentItem.flashcard.front}</h2>
                    {currentItem.flashcard.example && (
                      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                        <p className="text-sm text-slate-600 mb-1">Ví dụ:</p>
                        <p className="italic">{currentItem.flashcard.example}</p>
                      </div>
                    )}
                    <p className="text-slate-400 text-sm mt-6">Nhấn để xem đáp án</p>
                  </div>
                ) : (
                  <div style={{ transform: 'rotateY(180deg)' }}>
                    <p className="text-sm text-slate-500 mb-4">Đáp án</p>
                    <h2 className="mb-4 text-blue-600">{currentItem.flashcard.back}</h2>
                    <div className="border-t pt-6 mt-6">
                      <p className="text-sm text-slate-600 mb-4">Bạn nhớ từ này như thế nào?</p>
                      <div className="grid grid-cols-4 gap-2">
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQualityRating(1);
                          }}
                          className="flex flex-col h-auto py-3"
                        >
                          <span className="text-lg mb-1">😰</span>
                          <span className="text-xs">Quên</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQualityRating(3);
                          }}
                          className="flex flex-col h-auto py-3"
                        >
                          <span className="text-lg mb-1">🤔</span>
                          <span className="text-xs">Khó</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQualityRating(4);
                          }}
                          className="flex flex-col h-auto py-3"
                        >
                          <span className="text-lg mb-1">😊</span>
                          <span className="text-xs">Tốt</span>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQualityRating(5);
                          }}
                          className="flex flex-col h-auto py-3"
                        >
                          <span className="text-lg mb-1">🎯</span>
                          <span className="text-xs">Dễ</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsFlipped(false)}
            disabled={!isFlipped}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại thẻ
          </Button>
        </div>

        {/* Info card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Mẹo:</strong> Đánh giá trung thực giúp hệ thống nhắc ôn tập đúng lúc. 
              Từ khó sẽ xuất hiện thường xuyên hơn, từ dễ sẽ cách xa hơn.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}