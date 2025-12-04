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
import { AlertTriangle, Eye, Trash2 } from 'lucide-react';

const mockReports = [
  {
    id: '1',
    type: 'Content',
    reporter: 'Nguyen Van A',
    target: 'Vocabulary: "Hello"',
    reason: 'Sai phiên âm',
    description: 'Phiên âm của từ hello không chính xác',
    status: 'Pending',
    date: '2024-12-01',
  },
  {
    id: '2',
    type: 'User',
    reporter: 'Tran Thi B',
    target: 'User: @userxyz',
    reason: 'Spam',
    description: 'Người dùng này liên tục spam trong forum',
    status: 'Resolved',
    date: '2024-11-30',
  },
  {
    id: '3',
    type: 'Content',
    reporter: 'Le Van C',
    target: 'Quiz: "Business Terms"',
    reason: 'Câu hỏi sai',
    description: 'Câu hỏi số 5 có đáp án không chính xác',
    status: 'Pending',
    date: '2024-11-29',
  },
  {
    id: '4',
    type: 'Technical',
    reporter: 'Pham Thi D',
    target: 'App Bug',
    reason: 'Lỗi hiển thị',
    description: 'Flashcard không hiển thị đúng trên mobile',
    status: 'In Progress',
    date: '2024-11-28',
  },
];

export function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Báo cáo & Phản hồi</h1>
        <p className="text-muted-foreground mt-1">
          Quản lý các báo cáo và phản hồi từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Chờ xử lý</p>
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
            <p className="text-xs text-muted-foreground">Đã giải quyết</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Tổng báo cáo</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Mục tiêu</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.reporter}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{report.target}</div>
                      <div className="text-muted-foreground">{report.reason}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm text-muted-foreground">
                      {report.description}
                    </div>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        report.status === 'Pending'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : report.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          : 'bg-success/10 text-success border-success/20'
                      }
                      variant="outline"
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
