import { useAppStore } from "../../utils/store";
import { mockCourses, mockMarketplaceFolders } from "../../utils/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User, BookOpen, Award, ShoppingBag, TrendingUp } from "lucide-react";

export function ProfilePage() {
  const purchasedFolders = useAppStore((state) => state.purchasedFolders);
  const userProgress = useAppStore((state) => state.userProgress);
  const reviewItems = useAppStore((state) => state.reviewItems);

  const allFolders = [
    ...mockCourses.flatMap((c) => c.folders),
    ...mockMarketplaceFolders,
  ];

  const myFolders = allFolders.filter((f) => purchasedFolders.includes(f.id));
  const totalFlashcards = reviewItems.length;
  const completedFolders = userProgress.filter(
    (p) => p.completedFlashcards.length > 0
  ).length;

  // Mock user data
  const user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    joinDate: "15/01/2024",
    level: "Intermediate",
  };

  const totalSpent = myFolders
    .filter((f) => f.price > 0)
    .reduce((sum, f) => sum + f.price, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">Hồ sơ của tôi</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mb-1">{user.name}</h2>
                <p className="text-slate-600">{user.email}</p>
                <Badge variant="secondary" className="mt-3">
                  {user.level}
                </Badge>
              </div>
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Tham gia</p>
                    <p>{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Folders đã mua</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{myFolders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {myFolders.filter((f) => f.price === 0).length} miễn phí •{" "}
                  {myFolders.filter((f) => f.price > 0).length} đã mua
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
                  Tổng số flashcards đang học
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Folders hoàn thành</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{completedFolders}</div>
                <p className="text-xs text-muted-foreground">
                  Đã hoàn thành học tập
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Tổng chi tiêu</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{totalSpent.toLocaleString('vi-VN')}đ</div>
                <p className="text-xs text-muted-foreground">
                  Đã mua {myFolders.filter((f) => f.price > 0).length} folders
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.slice(0, 5).map((progress) => {
                  const folder = allFolders.find((f) => f.folderId === progress.folderId);
                  if (!folder) return null;

                  return (
                    <div key={progress.folderId} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">{folder.title}</p>
                        <p className="text-xs text-slate-500">
                          {progress.completedFlashcards.length} flashcards •{" "}
                          {progress.completedQuizzes.length} quiz
                        </p>
                      </div>
                    </div>
                  );
                })}
                {userProgress.length === 0 && (
                  <p className="text-slate-500 text-center py-4">
                    Chưa có hoạt động nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
