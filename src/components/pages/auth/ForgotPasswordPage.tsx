import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../utils/authStore';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { sendChangePasswordEmail, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/courses', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const success = await sendChangePasswordEmail(email);
      if (success) {
        setIsSent(true);
        toast.success('Đã gửi email khôi phục mật khẩu!');
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <img src="/app_icon.png" alt="App" className="w-24 h-24" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Khôi phục mật khẩu</h1>
            <p className="text-muted-foreground mt-2">
              Nhập email để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Quên mật khẩu?</CardTitle>
            <CardDescription>
              Đừng lo, chúng tôi sẽ giúp bạn lấy lại mật khẩu
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!isSent ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div className="text-center space-y-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm">
                    Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>.
                    Vui lòng kiểm tra hộp thư của bạn (cả mục spam).
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sau khi nhận được email, vui lòng nhập mã xác nhận vào trang đặt lại mật khẩu.
                  </p>
                  <Button 
                    type="button" 
                    onClick={() => navigate('/reset-password')}
                    className="w-full"
                  >
                    Đi tới trang đặt lại mật khẩu
                  </Button>
                  <Button 
                    variant="ghost" 
                    type="button" 
                    onClick={() => setIsSent(false)}
                    className="w-full"
                  >
                    Gửi lại
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 py-4">
              {!isSent && (
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi yêu cầu'
                  )}
                </Button>
              )}
              <Link 
                to="/login" 
                className="text-sm text-center text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Quay lại đăng nhập
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
