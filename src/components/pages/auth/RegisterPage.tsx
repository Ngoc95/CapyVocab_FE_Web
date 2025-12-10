import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../utils/authStore';
import { toast } from 'sonner';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username là bắt buộc';
    } else if (formData.username.length < 5 || formData.username.length > 20) {
      newErrors.username = 'Username phải từ 5-20 ký tự';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username chỉ được chứa chữ và số';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.email, formData.username, formData.password);
      
      if (success) {
        toast.success('Đăng ký thành công!');
        // Navigation is handled by useEffect
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Welcome */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <img src="/app_icon.png" alt="App" className="w-24 h-24" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Tham gia CapyVocab</h1>
            <p className="text-muted-foreground mt-2">
              Bắt đầu hành trình học tiếng Anh ngay hôm nay
            </p>
          </div>
        </div>

        {/* Register Form */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Tạo tài khoản</CardTitle>
            <CardDescription>
              Điền thông tin của bạn để bắt đầu
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username123"
                  value={formData.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  minLength={5}
                  maxLength={20}
                  pattern="[a-zA-Z0-9]+"
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username ? (
                  <p className="text-xs text-destructive">{errors.username}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    5-20 ký tự, chỉ chữ và số
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Tạo mật khẩu"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={6}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-xs text-destructive">{errors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Tối thiểu 6 ký tự, có ít nhất 1 chữ hoa
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Xác nhận mật khẩu"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    required
                    className={errors.confirmPassword ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

            </CardContent>
            <CardFooter className="flex flex-col gap-4 py-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  'Tạo tài khoản'
                )}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
