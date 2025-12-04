import { Link } from "react-router";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BookOpen, Brain, Store, Zap, Users, Award } from "lucide-react";

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6">
              Học tiếng Anh thông minh với Flashcard & Spaced Repetition
            </h1>
            <p className="mb-8 text-blue-100 text-lg">
              Nền tảng học tiếng Anh kết hợp công nghệ ôn tập thông minh, 
              cho phép bạn tạo và mua bán nội dung học tập
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" variant="secondary">
                  Khám phá khóa học
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                  Tạo nội dung
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Tính năng nổi bật</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Flashcard thông minh</CardTitle>
                <CardDescription>
                  Học từ vựng qua flashcard với hình ảnh, ví dụ và phát âm
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Spaced Repetition</CardTitle>
                <CardDescription>
                  Hệ thống ôn tập thông minh giúp ghi nhớ lâu hơn
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Store className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Marketplace</CardTitle>
                <CardDescription>
                  Tạo và bán nội dung học tập của bạn cho cộng đồng
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Quiz tương tác</CardTitle>
                <CardDescription>
                  Kiểm tra kiến thức với các bài quiz đa dạng
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <CardTitle>Cộng đồng học tập</CardTitle>
                <CardDescription>
                  Chia sẻ và học hỏi từ hàng ngàn người dùng
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>Theo dõi tiến độ</CardTitle>
                <CardDescription>
                  Thống kê chi tiết về quá trình học tập của bạn
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">Cách thức hoạt động</h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                1
              </div>
              <h3 className="mb-2">Chọn khóa học</h3>
              <p className="text-slate-600">
                Duyệt qua hàng trăm khóa học hoặc tạo nội dung riêng của bạn
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                2
              </div>
              <h3 className="mb-2">Học với Flashcard</h3>
              <p className="text-slate-600">
                Học từ vựng qua flashcard và hoàn thành quiz
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                3
              </div>
              <h3 className="mb-2">Ôn tập thông minh</h3>
              <p className="text-slate-600">
                Hệ thống tự động nhắc ôn tập đúng lúc để ghi nhớ lâu dài
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="py-12 text-center">
              <h2 className="mb-4 text-white">Bắt đầu hành trình học tiếng Anh ngay hôm nay</h2>
              <p className="mb-8 text-blue-100 text-lg max-w-2xl mx-auto">
                Tham gia cộng đồng hàng ngàn người học và cải thiện trình độ tiếng Anh của bạn
              </p>
              <Link to="/browse">
                <Button size="lg" variant="secondary">
                  Bắt đầu miễn phí
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
