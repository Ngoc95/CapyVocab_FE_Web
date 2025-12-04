import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { MessageSquare, Eye, CheckCircle2 } from 'lucide-react';

const mockTickets = [
  {
    id: '1',
    user: 'Nguyen Van A',
    email: 'nguyenvana@email.com',
    subject: 'Không thể truy cập khóa học',
    category: 'Technical',
    priority: 'High',
    status: 'Open',
    date: '2024-12-01 14:30',
    messages: 3,
  },
  {
    id: '2',
    user: 'Tran Thi B',
    email: 'tranthib@email.com',
    subject: 'Yêu cầu hoàn tiền',
    category: 'Billing',
    priority: 'High',
    status: 'In Progress',
    date: '2024-12-01 10:15',
    messages: 5,
  },
  {
    id: '3',
    user: 'Le Van C',
    email: 'levanc@email.com',
    subject: 'Hỏi về chứng chỉ',
    category: 'General',
    priority: 'Low',
    status: 'Closed',
    date: '2024-11-30 16:45',
    messages: 2,
  },
  {
    id: '4',
    user: 'Pham Thi D',
    email: 'phamthid@email.com',
    subject: 'Lỗi khi làm quiz',
    category: 'Technical',
    priority: 'Medium',
    status: 'Open',
    date: '2024-11-30 09:20',
    messages: 1,
  },
];

export function AdminSupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Hỗ trợ khách hàng</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý yêu cầu hỗ trợ từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Yêu cầu mới</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Đang xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Đã đóng</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Thời gian phản hồi TB</p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu hỗ trợ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Người dùng</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Ưu tiên</TableHead>
                <TableHead>Tin nhắn</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">#{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.user}</div>
                      <div className="text-sm text-muted-foreground">{ticket.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        ticket.priority === 'High'
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : ticket.priority === 'Medium'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-muted text-muted-foreground'
                      }
                      variant="outline"
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span>{ticket.messages}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{ticket.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        ticket.status === 'Open'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : ticket.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          : 'bg-success/10 text-success border-success/20'
                      }
                      variant="outline"
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {ticket.status !== 'Closed' && (
                        <Button variant="ghost" size="icon">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
