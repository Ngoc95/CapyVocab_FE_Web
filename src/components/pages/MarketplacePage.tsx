import { useState } from "react";
import { mockMarketplaceFolders } from "../../utils/mockData";
import { useAppStore } from "../../utils/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, BookOpen, Award, ShoppingCart, CheckCircle, User } from "lucide-react";

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const addToCart = useAppStore((state) => state.addToCart);
  const purchasedFolders = useAppStore((state) => state.purchasedFolders);

  const filteredFolders = mockMarketplaceFolders.filter((folder) =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Marketplace</h1>
        <p className="text-slate-600 mb-6">
          Khám phá và mua nội dung học tập từ cộng đồng
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFolders.map((folder) => {
          const isPurchased = purchasedFolders.includes(folder.id);

          return (
            <Card key={folder.id} className="flex flex-col">
              {folder.thumbnail && (
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={folder.thumbnail}
                    alt={folder.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="text-lg px-3 py-1">
                    {folder.price.toLocaleString('vi-VN')}đ
                  </Badge>
                  {isPurchased && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Đã mua
                    </Badge>
                  )}
                </div>
                <CardTitle>{folder.title}</CardTitle>
                <CardDescription>{folder.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{folder.flashcards.length} flashcards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{folder.quizzes.length} quiz</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>Tác giả: {folder.authorName}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Ngày tạo: {new Date(folder.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                {isPurchased ? (
                  <Button variant="outline" className="w-full" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đã sở hữu
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => addToCart({ folder, quantity: 1 })}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredFolders.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="mb-2">Không tìm thấy nội dung</h3>
          <p className="text-slate-600">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}

      {/* Info section */}
      <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="mb-4">Chia sẻ kiến thức, kiếm thu nhập</h2>
            <p className="text-slate-600 mb-6">
              Tạo và bán nội dung học tập của bạn trên Marketplace. 
              Giúp người khác học tập hiệu quả hơn và kiếm thu nhập thụ động.
            </p>
            <Button size="lg" onClick={() => window.location.href = "/create"}>
              Bắt đầu tạo nội dung
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
