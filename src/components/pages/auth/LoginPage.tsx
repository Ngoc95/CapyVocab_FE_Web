import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../utils/authStore';
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, googleLogin: loginWithGoogle, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/courses', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('Đăng nhập thành công!');
        // Navigation is handled by useEffect
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      // Note: This requires proper Google OAuth setup on client side
      // For now, we'll just handle the idToken if provided
      if (response.credential) {
        setIsLoading(true);
        const success = await loginWithGoogle(response.credential);
        if (success) {
          toast.success('Đăng nhập Google thành công!');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Đăng nhập Google thất bại');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Initialize Google Sign-In
      // @ts-ignore
      if (window.google) {
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '', // Make sure this is in .env
          callback: handleGoogleLogin,
        });
        // @ts-ignore
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Welcome */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <img src="/app_icon.png" alt="App" className="w-24 h-24" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">CapyVocab</h1>
            <p className="text-muted-foreground mt-2">
              Tiếp tục hành trình học tiếng Anh của bạn
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Đăng nhập vào CapyVocab</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập để truy cập tài khoản
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={5}
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground">
                  5-20 ký tự, chỉ chữ và số
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 py-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Đăng ký
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Or divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">Hoặc tiếp tục với</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center w-full">
          <div id="google-signin-button" className="w-full"></div>
        </div>
      </div>
    </div>
  );
}
