import { Link } from "react-router";
import { mockCourses } from "../../utils/mockData";
import { useAppStore } from "../../utils/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { BookOpen, Award, Calendar } from "lucide-react";

export function MyLearningPage() {
  const purchasedFolders = useAppStore((state) => state.purchasedFolders);
  const userProgress = useAppStore((state) => state.userProgress);
  const reviewItems = useAppStore((state) => state.reviewItems);

  const myFolders = mockCourses
    .flatMap((course) => course.folders)
    .filter((folder) => purchasedFolders.includes(folder.id));

  const totalFlashcards = reviewItems.length;
  const reviewedToday = reviewItems.filter((item) => {
    const today = new Date();
    const reviewDate = new Date(item.nextReview);
    return reviewDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Học tập của tôi</h1>
        <p className="text-slate-600">
          Theo dõi tiến độ và quản lý nội dung học tập
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tổng Folders</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{myFolders.length}</div>
            <p className="text-xs text-muted-foreground">
              Folders đang học
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Flashcards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalFlashcards}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số flashcards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Ôn tập hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{reviewedToday}</div>
            <p className="text-xs text-muted-foreground">
              Flashcards cần ôn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Folders List */}
      <div>
        <h2 className="mb-6">Folders của tôi</h2>
        {myFolders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="mb-2">Chưa có nội dung học tập</h3>
              <p className="text-slate-600 mb-6">
                Khám phá các khóa học và bắt đầu học ngay
              </p>
              <Link to="/browse">
                <Button>Duyệt khóa học</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFolders.map((folder) => {
              const progress = userProgress.find((p) => p.folderId === folder.id);
              const totalItems = folder.flashcards.length + folder.quizzes.length;
              const completedItems = 
                (progress?.completedFlashcards.length || 0) + 
                (progress?.completedQuizzes.length || 0);
              const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

              return (
                <Card key={folder.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{folder.title}</CardTitle>
                    <CardDescription>{folder.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-600">Tiến độ</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} />
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{folder.flashcards.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{folder.quizzes.length}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/learn/${folder.id}`} className="w-full">
                      <Button className="w-full" variant={progressPercent === 100 ? "outline" : "default"}>
                        {progressPercent === 100 ? "Học lại" : "Tiếp tục học"}
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
