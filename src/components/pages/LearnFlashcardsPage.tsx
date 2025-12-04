import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { mockCourses } from "../../utils/mockData";
import { useAppStore } from "../../utils/store";
import { FlashcardViewer } from "../FlashcardViewer";
import { QuizViewer } from "../QuizViewer";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { BookOpen, Award, CheckCircle } from "lucide-react";

export function LearnFlashcardsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateProgress = useAppStore((state) => state.updateProgress);
  const userProgress = useAppStore((state) => state.userProgress);
  
  const [flashcardsComplete, setFlashcardsComplete] = useState(false);
  const [quizzesComplete, setQuizzesComplete] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const folder = mockCourses
    .flatMap((course) => course.folders)
    .find((f) => f.id === id);

  if (!folder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2>Không tìm thấy nội dung học tập</h2>
        <Button onClick={() => navigate("/browse")} className="mt-4">
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const handleFlashcardsComplete = () => {
    setFlashcardsComplete(true);
    
    // Add to spaced repetition system
    const reviewItems = useAppStore.getState().reviewItems;
    const newReviewItems = folder.flashcards
      .filter(fc => !reviewItems.some(ri => ri.flashcardId === fc.id && ri.folderId === folder.id))
      .map(fc => ({
        flashcardId: fc.id,
        folderId: folder.id,
        flashcard: fc,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
      }));
    
    useAppStore.setState({
      reviewItems: [...reviewItems, ...newReviewItems],
    });
  };

  const handleQuizzesComplete = (score: number) => {
    setQuizzesComplete(true);
    setQuizScore(score);

    const progress = userProgress.find((p) => p.folderId === folder.id) || {
      folderId: folder.id,
      completedFlashcards: [],
      completedQuizzes: [],
      score: 0,
    };

    updateProgress({
      ...progress,
      completedFlashcards: folder.flashcards.map((fc) => fc.id),
      completedQuizzes: folder.quizzes.map((q) => q.id),
      score,
    });
  };

  const handleFinish = () => {
    navigate("/my-learning");
  };

  if (flashcardsComplete && quizzesComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="mb-4">Hoàn thành!</h2>
            <p className="text-slate-600 mb-2">
              Bạn đã hoàn thành folder: <strong>{folder.title}</strong>
            </p>
            {folder.quizzes.length > 0 && (
              <p className="text-lg mb-6">
                Điểm quiz: <span className="text-blue-600">{quizScore}/{folder.quizzes.length}</span>
              </p>
            )}
            <p className="text-sm text-slate-500 mb-8">
              Các flashcard đã được thêm vào hệ thống ôn tập thông minh
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleFinish}>
                Về trang học tập
              </Button>
              <Button variant="outline" onClick={() => navigate("/review")}>
                Đi đến ôn tập
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2">{folder.title}</h1>
        <p className="text-slate-600">{folder.description}</p>
      </div>

      <Tabs defaultValue="flashcards" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Flashcards ({folder.flashcards.length})
          </TabsTrigger>
          <TabsTrigger 
            value="quiz" 
            className="flex items-center gap-2"
            disabled={!flashcardsComplete || folder.quizzes.length === 0}
          >
            <Award className="w-4 h-4" />
            Quiz ({folder.quizzes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="mt-8">
          {!flashcardsComplete ? (
            <FlashcardViewer
              flashcards={folder.flashcards}
              onComplete={handleFlashcardsComplete}
            />
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="mb-2">Đã hoàn thành Flashcards!</h3>
                <p className="text-slate-600 mb-4">
                  {folder.quizzes.length > 0 
                    ? "Chuyển sang tab Quiz để kiểm tra kiến thức"
                    : "Nhấn hoàn thành để kết thúc"}
                </p>
                {folder.quizzes.length === 0 && (
                  <Button onClick={() => {
                    setQuizzesComplete(true);
                    setQuizScore(0);
                  }}>
                    Hoàn thành
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quiz" className="mt-8">
          {folder.quizzes.length > 0 ? (
            <QuizViewer
              quizzes={folder.quizzes}
              onComplete={handleQuizzesComplete}
            />
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-slate-600">Folder này chưa có quiz</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
