import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../utils/authStore';
import { toast } from 'sonner';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, sendVerificationEmail, user } = useAuthStore();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // If user is already verified or not logged in, redirect
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    } else if (user.status === 'VERIFIED') {
      navigate('/courses', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    try {
      const success = await verifyEmail(code);
      if (success) {
        toast.success('Xác thực email thành công!');
        // Navigation is handled by useEffect when user status updates
      }
    } catch (error) {
      toast.error('Mã xác thực không đúng hoặc đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await sendVerificationEmail();
      toast.success('Đã gửi lại mã xác thực!');
    } catch (error) {
      toast.error('Không thể gửi lại mã. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
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
            <h1 className="text-3xl font-bold">Xác thực Email</h1>
            <p className="text-muted-foreground mt-2">
              Vui lòng nhập mã xác thực đã được gửi đến email của bạn
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Nhập mã xác thực</CardTitle>
            <CardDescription>
              Kiểm tra hộp thư đến (và spam) của <strong>{user?.email}</strong>
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã xác thực</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Nhập mã 6 số"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Chưa nhận được mã?
                </p>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi lại mã'
                  )}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 py-4">
              <Button type="submit" className="w-full" disabled={isLoading || code.length < 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  'Xác thực'
                )}
              </Button>
              <Button 
                variant="outline" 
                type="button" 
                className="w-full"
                onClick={() => {
                  useAuthStore.getState().logout();
                  navigate('/login');
                }}
              >
                Đăng xuất
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
