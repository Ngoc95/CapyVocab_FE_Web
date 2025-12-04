import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';

const mockWithdrawals = [
  {
    id: '1',
    user: 'Nguyen Van A',
    email: 'nguyenvana@email.com',
    amount: 500000,
    method: 'Bank Transfer',
    bankName: 'Vietcombank',
    bankAccount: '1234567890',
    requestDate: '2024-12-01',
    status: 'Pending',
  },
  {
    id: '2',
    user: 'Tran Thi B',
    email: 'tranthib@email.com',
    amount: 1200000,
    method: 'PayPal',
    bankName: '-',
    bankAccount: 'tranthib@paypal.com',
    requestDate: '2024-11-30',
    status: 'Approved',
  },
  {
    id: '3',
    user: 'Le Van C',
    email: 'levanc@email.com',
    amount: 350000,
    method: 'Bank Transfer',
    bankName: 'Techcombank',
    bankAccount: '0987654321',
    requestDate: '2024-11-28',
    status: 'Rejected',
  },
];

export function AdminWithdrawPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý Rút tiền</h1>
        <p className="text-muted-foreground mt-1">
          Xử lý yêu cầu rút tiền từ người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Chờ xử lý</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Đã duyệt</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Từ chối</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.05M đ</div>
                <p className="text-xs text-muted-foreground">Tổng tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Yêu cầu rút tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{withdrawal.user}</div>
                      <div className="text-sm text-muted-foreground">{withdrawal.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{withdrawal.amount.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <Badge variant="outline">{withdrawal.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{withdrawal.bankName}</div>
                      <div className="text-muted-foreground">{withdrawal.bankAccount}</div>
                    </div>
                  </TableCell>
                  <TableCell>{withdrawal.requestDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        withdrawal.status === 'Pending'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : withdrawal.status === 'Approved'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                      }
                      variant="outline"
                    >
                      {withdrawal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {withdrawal.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="text-success">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Duyệt
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    )}
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
