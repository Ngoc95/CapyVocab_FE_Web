import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { User } from '../../services/userService';
import { Flame, Calendar, Wallet } from 'lucide-react';

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSubmit: (user: {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
    roleId: number;
    status?: 'NOT_VERIFIED' | 'VERIFIED';
  }) => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: UserFormDialogProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [roleId, setRoleId] = useState<number>(user?.role.id ?? 1); // Default to USER role (1)
  const [status, setStatus] = useState<'NOT_VERIFIED' | 'VERIFIED'>('NOT_VERIFIED');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setAvatar(user.avatar || '');
      setRoleId(user.role.id ?? 1);
      setStatus(user.status);
      setPassword(''); // Don't show password when editing
    } else {
      setUsername('');
      setEmail('');
      setPassword('');
      setAvatar('');
      setRoleId(1); // Default to USER
      setStatus('NOT_VERIFIED');
    }
  }, [user, open]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      username,
      email,
      password: user ? undefined : password, // Only require password for new users
      avatar: avatar || undefined,
      roleId,
      status: user ? status : undefined, // Only set status when editing
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'Cập nhật thông tin người dùng'
              : 'Tạo người dùng mới'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ví dụ: username123 (5-20 ký tự, chỉ chữ và số)"
                required
                minLength={5}
                maxLength={20}
                pattern="[a-zA-Z0-9]+"
              />
              <p className="text-xs text-muted-foreground">
                5-20 ký tự, chỉ chữ và số
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ví dụ: example@email.com"
                required
              />
            </div>

            {!user && (
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự, có ít nhất 1 chữ hoa"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">
                  Tối thiểu 6 ký tự, có ít nhất 1 chữ hoa
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Avatar</Label>
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">Nhập URL</TabsTrigger>
                  <TabsTrigger value="upload">Tải lên</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-2">
                  <Input
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </TabsContent>
                <TabsContent value="upload" className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFileChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Kích thước tối đa: 2MB
                  </p>
                </TabsContent>
              </Tabs>
              {avatar && (
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="w-16 h-16 object-cover rounded-full border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setAvatar('')}
                  >
                    Xóa avatar
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Vai trò *</Label>
              <Select
                value={String(roleId)}
                onValueChange={(value) => setRoleId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">ADMIN</SelectItem>
                  <SelectItem value="2">USER</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {user && (
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as 'NOT_VERIFIED' | 'VERIFIED')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOT_VERIFIED">Chưa xác thực</SelectItem>
                    <SelectItem value="VERIFIED">Đã xác thực</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Readonly fields - only show when editing */}
            {user && (
              <div className="space-y-3 pt-2 border-t">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Flame className="w-4 h-4" />
                      <span>Streak</span>
                    </div>
                    <p className="font-medium">{user.streak} ngày</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Wallet className="w-4 h-4" />
                      <span>Số dư</span>
                    </div>
                    <p className="font-medium">{Number(user.balance ?? 0).toLocaleString('vi-VN')} đ</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Học cuối</span>
                    </div>
                    <p className="font-medium">
                      {new Date(user.lastStudyDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia</span>
                    </div>
                    <p className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              {user ? 'Cập nhật' : 'Thêm người dùng'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}