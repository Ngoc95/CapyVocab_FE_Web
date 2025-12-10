import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Search, Plus, Edit, Trash2, Flame, Calendar, Wallet, Shield, RotateCcw, Loader2 } from 'lucide-react';
import { UserFormDialog } from '../../admin/UserFormDialog';
import { userService, User, UserListParams } from '../../../services/userService';
import { toast } from 'sonner';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('id');

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | undefined>();
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: UserListParams = {
        page: currentPage,
        limit: pageSize,
        sort: sortBy,
      };

      if (searchQuery) {
        // Try email first, then username
        if (searchQuery.includes('@')) {
          params.email = searchQuery;
        } else {
          params.username = searchQuery;
        }
      }

      if (roleFilter !== 'all') {
        params.roleName = roleFilter.toUpperCase();
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter as 'NOT_VERIFIED' | 'VERIFIED';
      }

      const response = await userService.getUsers(params);
      setUsers(response.metaData.users);
      setTotalUsers(response.metaData.total);
      setCurrentPage(response.metaData.currentPage);
      setTotalPages(response.metaData.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
      toast.error(err.message || 'Có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, roleFilter, statusFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchUsers();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddUser = () => {
    setEditingUser(undefined);
    setIsFormDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      setIsDeleting(true);
      await userService.deleteUser(deletingUser.id);
      toast.success('Xóa người dùng thành công');
      setIsDeleteDialogOpen(false);
      setDeletingUser(undefined);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreUser = async (user: User) => {
    try {
      await userService.restoreUser(user.id);
      toast.success('Khôi phục người dùng thành công');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi khôi phục người dùng');
    }
  };

  const handleSubmit = async (userData: {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
    roleId: number;
    status?: 'NOT_VERIFIED' | 'VERIFIED';
  }) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, {
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          roleId: userData.roleId,
          status: userData.status,
        });
        toast.success('Cập nhật người dùng thành công');
      } else {
        if (!userData.password) {
          toast.error('Vui lòng nhập mật khẩu');
          return;
        }
        await userService.createUser({
          email: userData.email,
          username: userData.username,
          password: userData.password,
          roleId: userData.roleId,
          avatar: userData.avatar,
        });
        toast.success('Tạo người dùng thành công');
      }
      setIsFormDialogOpen(false);
      setEditingUser(undefined);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const avgStreak = users.length > 0
    ? Math.round(users.reduce((sum, u) => sum + u.streak, 0) / users.length)
    : 0;

  const adminCount = users.filter((u) => u.role.name === 'ADMIN').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản lý người dùng</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả người dùng đã đăng ký</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng người dùng</p>
              <p className="text-2xl">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="text-2xl">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng số dư</p>
              <p className="text-2xl">{totalBalance.toLocaleString('vi-VN')} đ</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Streak trung bình</p>
              <p className="text-2xl">{avgStreak} ngày</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo email hoặc username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="VERIFIED">Đã xác thực</SelectItem>
                <SelectItem value="NOT_VERIFIED">Chưa xác thực</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">ID (Tăng dần)</SelectItem>
                <SelectItem value="-id">ID (Giảm dần)</SelectItem>
                <SelectItem value="email">Email (A-Z)</SelectItem>
                <SelectItem value="-email">Email (Z-A)</SelectItem>
                <SelectItem value="username">Username (A-Z)</SelectItem>
                <SelectItem value="-username">Username (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive py-8">{error}</div>
          ) : (
            <>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Streak</TableHead>
                      <TableHead>Số dư</TableHead>
                      <TableHead>Học cuối</TableHead>
                      <TableHead className="w-[140px]">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          Không tìm thấy người dùng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.username}
                                  className="w-10 h-10 rounded-full object-cover border"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-primary">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span>{user.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            {user.role.name === 'ADMIN' ? (
                              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                User
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'VERIFIED' ? 'default' : 'secondary'}>
                              {user.status === 'VERIFIED' ? 'Đã xác thực' : 'Chưa xác thực'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span>{user.streak ?? 0}</span>

                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Wallet className="w-4 h-4 text-green-500" />
                              <span>{Number(user.balance ?? 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
  {user.lastStudyDate ? formatDate(user.lastStudyDate) : 'Chưa học'}
</span>

                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {user.deletedAt ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRestoreUser(user)}
                                  title="Khôi phục"
                                >
                                  <RotateCcw className="w-4 h-4 text-green-500" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(user)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Trang {currentPage} / {totalPages} ({totalUsers} người dùng)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <UserFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{deletingUser?.username}"? 
              Đây là soft delete, bạn có thể khôi phục sau.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
