import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { useAuthStore } from '../../../utils/authStore';
import { useEffect } from 'react';
import { authService } from '../../../services/authService';
import { postService } from '../../../services/postService';
import { User, userService } from '../../../services/userService';
import { 
  Settings, 
  Calendar,
  TrendingUp,
  Flame,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

function StatsCards({ totalStudyDay, streak, balance }: { totalStudyDay?: number; streak?: number; balance?: number }) {
  const items = [
    { label: 'Tổng ngày học', value: String(totalStudyDay ?? 0), icon: Calendar, color: 'text-success' },
    { label: 'Day Streak', value: String(streak ?? 0), icon: Flame, color: 'text-warning' },
    { label: 'Số dư (VNĐ)', value: `${(balance ?? 0).toLocaleString('vi-VN')}đ`, icon: TrendingUp, color: 'text-purple-500' },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((stat, index) => (
        <Card key={index}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`w-12 h-12 bg-${stat.color.split('-')[1]}/10 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function NewProfilePage() {
  const [user, setUser] = React.useState<User | null>(null);
  const [open, setOpen] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    username: '',
    email: '',
    avatar: '',
  });
  const [passwordForm, setPasswordForm] = React.useState({
    oldPassword: '',
    newPassword: '',
  });
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const buildUpdatePayload = (form: typeof profileForm, user: any) => {
    const payload: any = {};
    if (form.username && form.username !== user.username) payload.username = form.username;
    if (form.email && form.email !== user.email) payload.email = form.email;
    if (form.avatar && form.avatar !== user.avatar) payload.avatar = form.avatar;
    return payload;
};
const refreshUser = async () => {
  const res = await authService.getAccount();
  const u = res.metaData.user;

  setUser({
    id: u.id,
    email: u.email,
    username: u.username,
    name: u.username,
    role: u.role.name as any,
    avatar: u.avatar,
    status: u.status,
    streak: u.streak || 0,
  });

  setProfileForm({
    username: u.username || '',
    email: u.email || '',
    avatar: u.avatar || '',
  });
};


  useEffect(() => {
    authService.getAccount()
      .then((res) => {
        const u = res.metaData.user;
        console.log(u)
        setUser({
          id: u.id,
          email: u.email,
          username: u.username,
          name: u.username,
          role: u.role.name as any,
          avatar: u.avatar,
          status: u.status,
          streak: u.streak || 0,
        });
        setProfileForm({ username: u.username || '', email: u.email || '', avatar: u.avatar || '' });
      })
      .catch(() => {});
  }, [setUser]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Profile Header */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl">{user?.name}</h1>
                    {user?.role === 'admin' && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Settings className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cài đặt tài khoản</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="profile" className="mt-2">
                      <TabsList>
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                      </TabsList>
                      <TabsContent value="profile" className="mt-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm">Tên đăng nhập</p>
                            <Input value={profileForm.username} onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
                          </div>
                          <div>
                            <p className="text-sm">Email</p>
                            <Input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                          </div>
                          <div className="space-y-2">
  <p className="text-sm">Ảnh đại diện</p>

  <div className="flex items-center gap-4">
    {/* Hiển thị hình avatar nếu có */}
    <Avatar className="w-16 h-16 border-4 border-primary">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>

    <div>
      {/* Input file ẩn */}
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          try {
            setLoading(true);
            const urls = await postService.uploadImages([file]);
            const url = urls[0] || '';
            setProfileForm({ ...profileForm, avatar: url });
          } finally {
            setLoading(false);
          }
        }}
      />

      {/* Button custom */}
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer px-4 py-2 bg-[#1AB1F6] text-white rounded-lg hover:bg-[#1599d6] transition"
      >
        Chọn ảnh
      </label>
    </div>
  </div>
</div>

                          <div className="flex justify-end">
                            <Button
  disabled={loading}
  onClick={async () => {
    try {
      setLoading(true);

      if (!user?.id) return;

      const payload = buildUpdatePayload(profileForm, user);

      if (Object.keys(payload).length > 0) {
        await userService.updateUser(user.id, payload);
        await refreshUser();
        toast.success("Cập nhật thông tin thành công!");
      }

      setOpen(false);
    } catch {
      toast.error("Cập nhật thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }}
>
  Lưu thay đổi
</Button>

                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="password" className="mt-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm">Mật khẩu hiện tại</p>
                            <div className="flex items-center gap-2">
                              <Input type={showOld ? 'text' : 'password'} value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} />
                              <Button variant="outline" size="sm" onClick={() => setShowOld(!showOld)}>
                                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm">Mật khẩu mới</p>
                            <div className="flex items-center gap-2">
                              <Input type={showNew ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                              <Button variant="outline" size="sm" onClick={() => setShowNew(!showNew)}>
                                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm">Xác nhận mật khẩu mới</p>
                            <div className="flex items-center gap-2">
                              <Input type={showConfirm ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                              <Button variant="outline" size="sm" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
  disabled={
    loading ||
    passwordForm.newPassword.length === 0 ||
    passwordForm.newPassword !== confirmNewPassword
  }
  onClick={async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      if (passwordForm.newPassword !== confirmNewPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }

      await userService.updateUser(user.id, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Đổi mật khẩu thành công!");

      // Clear form
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setConfirmNewPassword("");
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);

      // Fetch lại user data
      await refreshUser();

      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  }}
>
  Đổi mật khẩu
</Button>

                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-warning fill-warning" />
                <span>{user?.streak ?? 0} day streak</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StatsCards totalStudyDay={undefined} streak={user?.streak} balance={undefined} />
    </div>
  );
}
