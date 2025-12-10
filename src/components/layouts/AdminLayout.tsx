import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Folder,
  DollarSign,
  FileText,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Eye
} from 'lucide-react';
import { cn } from '../ui/utils';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useAuthStore } from '../../utils/authStore';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, viewAsUser, toggleViewAsUser } = useAuthStore();

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Trang chủ' },
    { path: '/admin/courses', icon: GraduationCap, label: 'Khóa học' },
    { path: '/admin/topics', icon: Folder, label: 'Chủ đề' },
    { path: '/admin/vocabulary', icon: BookOpen, label: 'Từ vựng' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
    { path: '/admin/withdraw', icon: DollarSign, label: 'Rút tiền' },
    { path: '/admin/reports', icon: FileText, label: 'Báo cáo' },
    { path: '/admin/support', icon: HelpCircle, label: 'Hỗ trợ' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewAsUser = () => {
    navigate('/courses');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          
            <img src="/app_icon.png" alt="App" className="w-8 h-8" />
          
          <div>
            <h2 className="font-semibold">CapyVocab</h2>
            <Badge variant="outline" className="text-xs mt-1">Admin Panel</Badge>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-accent text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleViewAsUser}
        >
          <Eye className="w-4 h-4 mr-2" />
          Xem dạng User
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
        {/* User Info */}
        <div className="pt-2 px-2">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 border-r bg-card flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <img src="/app_icon.png" alt="App" className="w-8 h-8" />
              <span className="font-semibold">CapyVocab</span>
            </div>
            <Badge variant="outline">Admin</Badge>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
