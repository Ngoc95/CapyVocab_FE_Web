import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { User } from "lucide-react";
import { useAuthStore } from "../../utils/authStore";
import { postService } from "../../services/postService";
import { authService } from "../../services/authService";
import { toast } from "sonner";

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [roleName, setRoleName] = useState(user?.role || "USER");
  const [status, setStatus] = useState<'NOT_VERIFIED' | 'VERIFIED' | undefined>(user?.status);
  const [streak, setStreak] = useState<number | undefined>(user?.streak);
  const [totalStudyDay, setTotalStudyDay] = useState<number | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    authService.getAccount()
      .then((res) => {
        const u = res.metaData.user;
        setDisplayName(u.username || "");
        setEmail(u.email || "");
        setAvatar(u.avatar || "");
        setRoleName(u.role?.name || "USER");
        setStatus(u.status);
        setStreak(u.streak);
        setTotalStudyDay(u.totalStudyDay);
      })
      .catch((e: any) => {
        toast.error(e?.message || "Tải thông tin tài khoản thất bại");
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8">Hồ sơ của tôi</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={avatar} alt={displayName} />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {(displayName || "?").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploading(true);
                        const urls = await postService.uploadImages([file]);
                        const url = urls[0] || "";
                        setAvatar(url);
                        await updateProfile({ avatar: url });
                      } catch {}
                      finally { setUploading(false); }
                    }}
                  />
                </div>
                <h2 className="mb-1">{displayName}</h2>
                <p className="text-slate-600">{email}</p>
                <Badge variant="secondary" className="mt-3">
                  {roleName}
                </Badge>
              </div>
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Trạng thái</p>
                    <p>{status === 'VERIFIED' ? 'Đã xác minh' : 'Chưa xác minh'}</p>
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <label className="text-sm">Tên hiển thị</label>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <label className="text-sm">Email</label>
                  <input
                    className="border rounded px-3 py-2 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="text-sm text-slate-600">Chuỗi ngày học</div>
                    <div>{streak ?? 0}</div>
                    <div className="text-sm text-slate-600">Tổng ngày học</div>
                    <div>{totalStudyDay ?? 0}</div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      onClick={async () => {
                        await updateProfile({ username: displayName, email });
                      }}
                      disabled={uploading}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2" />
      </div>
    </div>
  );
}
