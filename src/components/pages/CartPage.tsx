import { useAppStore } from "../../utils/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ShoppingCart, Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

export function CartPage() {
  const cart = useAppStore((state) => state.cart);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const clearCart = useAppStore((state) => state.clearCart);
  const purchaseFolder = useAppStore((state) => state.purchaseFolder);
  const [isCheckoutComplete, setIsCheckoutComplete] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.folder.price * item.quantity, 0);

  const handleCheckout = () => {
    // In a real app, this would process payment
    cart.forEach((item) => {
      purchaseFolder(item.folder.id);
    });
    clearCart();
    setIsCheckoutComplete(true);
  };

  if (isCheckoutComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="mb-4">Thanh toán thành công!</h2>
            <p className="text-slate-600 mb-8">
              Nội dung đã được thêm vào thư viện học tập của bạn
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.location.href = "/my-learning"}>
                Đến học tập
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/marketplace"}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="mb-4">Giỏ hàng trống</h2>
            <p className="text-slate-600 mb-8">
              Khám phá Marketplace để tìm nội dung học tập phù hợp
            </p>
            <Button onClick={() => window.location.href = "/marketplace"}>
              Đến Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">Giỏ hàng</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.folder.id}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {item.folder.thumbnail && (
                      <img
                        src={item.folder.thumbnail}
                        alt={item.folder.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="mb-1">{item.folder.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">
                        {item.folder.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{item.folder.flashcards.length} flashcards</span>
                        <span>{item.folder.quizzes.length} quiz</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg mb-2">
                        {item.folder.price.toLocaleString('vi-VN')}đ
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.folder.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tổng quan đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tạm tính</span>
                  <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Giảm giá</span>
                  <span>0đ</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Tổng cộng</span>
                <span className="text-xl text-blue-600">
                  {totalPrice.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                * Đây là website demo, thanh toán chỉ mang tính chất mô phỏng
              </p>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button onClick={handleCheckout} size="lg" className="w-full">
                Thanh toán
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/marketplace"}
                className="w-full"
              >
                Tiếp tục mua sắm
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
