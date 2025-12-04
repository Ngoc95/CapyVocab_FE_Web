import { Link } from "react-router";
import { Button } from "../ui/button";
import { AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <AlertCircle className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <h1 className="mb-4">404</h1>
        <h2 className="mb-4">Không tìm thấy trang</h2>
        <p className="text-slate-600 mb-8">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link to="/">
          <Button>Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
