import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, BookOpen, GraduationCap, Plus, Store, User, Brain } from "lucide-react";
import { useAppStore } from "../utils/store";
import { Badge } from "./ui/badge";

export function RootLayout() {
  const location = useLocation();
  const cart = useAppStore((state) => state.cart);
  const getItemsDueForReview = useAppStore((state) => state.getItemsDueForReview);
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const reviewCount = getItemsDueForReview().length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-blue-600">EnglishHub</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/browse"
                className={`flex items-center gap-2 ${isActive('/browse') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Khóa học</span>
              </Link>
              <Link
                to="/my-learning"
                className={`flex items-center gap-2 ${isActive('/my-learning') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Học của tôi</span>
              </Link>
              <Link
                to="/review"
                className={`flex items-center gap-2 relative ${isActive('/review') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                <Brain className="w-4 h-4" />
                <span>Ôn tập</span>
                {reviewCount > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {reviewCount}
                  </Badge>
                )}
              </Link>
              <Link
                to="/marketplace"
                className={`flex items-center gap-2 ${isActive('/marketplace') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                <Store className="w-4 h-4" />
                <span>Marketplace</span>
              </Link>
              <Link
                to="/create"
                className={`flex items-center gap-2 ${isActive('/create') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                <Plus className="w-4 h-4" />
                <span>Tạo nội dung</span>
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`} />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
              <Link to="/profile">
                <User className={`w-6 h-6 ${isActive('/profile') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <span className="text-blue-600">EnglishHub</span>
              </div>
              <p className="text-slate-600 text-sm">
                Nền tảng học tiếng Anh thông minh với flashcard và spaced repetition
              </p>
            </div>
            <div>
              <h3 className="mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><Link to="/browse" className="hover:text-blue-600">Khóa học</Link></li>
                <li><Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link></li>
                <li><Link to="/create" className="hover:text-blue-600">Tạo nội dung</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-blue-600">Liên hệ</a></li>
                <li><a href="#" className="hover:text-blue-600">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Pháp lý</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#" className="hover:text-blue-600">Điều khoản</a></li>
                <li><a href="#" className="hover:text-blue-600">Chính sách</a></li>
                <li><a href="#" className="hover:text-blue-600">Quyền riêng tư</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-slate-600">
            © 2024 EnglishHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}