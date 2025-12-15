import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { paymentService } from '../../../services/paymentService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Đang xác thực thanh toán...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const res = await paymentService.handleVnpayReturn(params);
        const order = res.metaData;

        if (order.status === 'SUCCESS') {
          setStatus('success');
          setMessage('Thanh toán thành công! Bạn đã có quyền truy cập học liệu.');
        } else {
          setStatus('failed');
          setMessage('Thanh toán thất bại hoặc bị hủy.');
        }
      } catch (error) {
        console.error('Payment callback error', error);
        setStatus('failed');
        setMessage('Có lỗi xảy ra khi xác thực thanh toán.');
      }
    };

    handleCallback();
  }, [searchParams]);

  const handleBack = () => {
    // Try to get folderId from somewhere or go back to materials list
    // Since we don't have folderId directly in URL params usually unless passed back
    // We can go to materials page
    navigate('/materials');
  };

  return (
    <div className="container mx-auto max-w-md py-20 px-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
            {status === 'success' && <CheckCircle className="h-12 w-12 text-success" />}
            {status === 'failed' && <XCircle className="h-12 w-12 text-destructive" />}
          </div>
          <CardTitle>
            {status === 'loading' && 'Đang xử lý'}
            {status === 'success' && 'Thanh toán thành công'}
            {status === 'failed' && 'Thanh toán thất bại'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {status !== 'loading' && (
            <Button onClick={handleBack}>
              Quay lại danh sách học liệu
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
