import { useParams, Link } from "react-router";
import { mockCourses } from "../../utils/mockData";
import { useAppStore } from "../../utils/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { BookOpen, Clock, Award, ShoppingCart, CheckCircle } from "lucide-react";

export function CourseDetailPage() {
  const { id } = useParams();
  const addToCart = useAppStore((state) => state.addToCart);
  const purchasedFolders = useAppStore((state) => state.purchasedFolders);
  
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2>Không tìm thấy khóa học</h2>
        <Link to="/browse">
          <Button className="mt-4">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={course.isFree ? "secondary" : "default"}>
                {course.isFree ? "Miễn phí" : "Trả phí"}
              </Badge>
              <Badge variant="outline">{course.level}</Badge>
            </div>
            <h1 className="mb-4">{course.title}</h1>
            <p className="text-slate-600 text-lg">{course.description}</p>
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-8">
            <h2 className="mb-6">Nội dung khóa học</h2>
            <div className="space-y-4">
              {course.folders.map((folder) => {
                const isPurchased = purchasedFolders.includes(folder.id);
                
                return (
                  <Card key={folder.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{folder.title}</CardTitle>
                          <CardDescription>{folder.description}</CardDescription>
                        </div>
                        {isPurchased ? (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Đã sở hữu
                          </Badge>
                        ) : folder.price > 0 ? (
                          <Badge>{folder.price.toLocaleString('vi-VN')}đ</Badge>
                        ) : (
                          <Badge variant="secondary">Miễn phí</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{folder.flashcards.length} flashcard</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{folder.quizzes.length} quiz</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="gap-2">
                      {isPurchased ? (
                        <Link to={`/learn/${folder.id}`} className="flex-1">
                          <Button className="w-full">Bắt đầu học</Button>
                        </Link>
                      ) : folder.price > 0 ? (
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() => addToCart({ folder, quantity: 1 })}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Thêm vào giỏ
                        </Button>
                      ) : (
                        <Link to={`/learn/${folder.id}`} className="flex-1">
                          <Button className="w-full">Bắt đầu học miễn phí</Button>
                        </Link>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Thông tin khóa học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Số folder</p>
                  <p>{course.folders.length} folder</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Thời lượng</p>
                  <p>Tự học theo tốc độ riêng</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Cấp độ</p>
                  <p>{course.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
