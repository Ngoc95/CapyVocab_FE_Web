import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Heart, Eye, Code, Edit, AlertTriangle, MessageSquare, Play, FileText, Lock, ShoppingCart, Loader2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { Textarea } from '../../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { toast } from 'sonner';
import { useAuthStore } from '../../../utils/authStore';
import type { Material, Comment } from '../../../types';
import { exerciseService } from '../../../services/exerciseService';
import { paymentService } from '../../../services/paymentService';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "../../ui/alert-dialog";
// Mock data
const mockMaterial: Material = {
  id: '1',
  code: 'FUYI5K',
  title: 'Từ vựng IELTS',
  description: 'Bộ từ vựng IELTS cơ bản cho người mới bắt đầu, bao gồm các chủ đề thường gặp trong kỳ thi.',
  authorId: 'user2',
  authorName: 'User001',
  authorEmail: 'User001@gmail.com',
  isPublic: true,
  price: 0,
  flashcards: [
    {
      id: 'f1',
      term: 'Academic',
      definition: 'Thuộc về học thuật',
    },
    {
      id: 'f2',
      term: 'Achievement',
      definition: 'Thành tựu, thành tích',
    },
  ],
  quizzes: [],
  likes: 0,
  views: 0,
  comments: [],
  isPurchased: false,
  createdAt: '2024-01-15',
  updatedAt: '2024-01-15',
};

export function MaterialDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get preview material from location state if available
  const previewMaterial = location.state?.previewMaterial as Material | undefined;

  useEffect(() => {
    const folderId = Number(id);
    if (!folderId) return;

    const fetchMaterial = async () => {
      try {
        setError(null);
        // 1. Get folder details
        const res = await exerciseService.getFolderById(folderId);
        const f = res.metaData;
        
        // 2. Check purchase status if needed
        let isPurchased = false;
        // Logic to check purchase status will be here based on API response or additional check
        // Assuming f.isPurchased or similar field exists, otherwise check order status
        
        if (user && f.price > 0 && String(f.createdBy?.id) !== String(user.id)) {
           try {
             const statusRes = await paymentService.checkOrderStatus(folderId);
             if (statusRes.metaData && statusRes.metaData.status === 'SUCCESS') {
               isPurchased = true;
             } else if (statusRes.metaData && statusRes.metaData.status === 'PENDING') {
                setPendingOrder(statusRes.metaData);
             }
           } catch (err) {
             console.error('Failed to check order status', err);
           }
        }

        const mapped: Material = {
          id: String(f.id),
          code: f.code || '',
          title: f.name,
          description: '',
          authorId: String(f.createdBy?.id || ''),
          authorName: f.createdBy?.username || '',
          authorEmail: f.createdBy?.email || '',
          isPublic: !!f.isPublic,
          price: Number(f.price) || 0,
          flashcards: (f.flashCards || []).map((fc: any, idx: number) => ({ id: String(fc.id ?? idx), term: fc.frontContent || '', definition: fc.backContent || '' })),
          quizzes: (f.quizzes || []).flatMap((q: any) => (q.question || []).map((qq: any, i: number) => ({ id: `${q.id}-${i}`, term: qq.question, definition: '' }))),
          likes: f.voteCount || 0,
          views: f.totalAttemptCount || 0,
          comments: [],
          isPurchased: isPurchased, // Use the checked status
          createdAt: f.createdAt,
          updatedAt: f.createdAt,
        };
        setMaterial(mapped);
        setIsLiked(!!f.isAlreadyVote);
      } catch (error: any) {
        console.error('Failed to load material', error);
        
        // If we have preview material from navigation state, use it to show payment dialog
        if (previewMaterial) {
            // Check order status even if getFolder failed, in case user already bought it but API is weird
            if (user) {
                try {
                     const statusRes = await paymentService.checkOrderStatus(folderId);
                     if (statusRes.metaData && statusRes.metaData.status === 'SUCCESS') {
                       // If purchased but getFolder failed, it's a real error
                       setError(error?.message || 'Không thể tải nội dung học liệu');
                       return;
                     } else if (statusRes.metaData && statusRes.metaData.status === 'PENDING') {
                        setPendingOrder(statusRes.metaData);
                     }
                } catch {}
            }
            
            setMaterial({
                ...previewMaterial,
                isPurchased: false // Force false to show payment dialog
            });
            setShowPayment(true); // Auto open payment dialog
        } else {
             setError(error?.message || 'Không thể tải thông tin học liệu');
        }
      }
    };

    fetchMaterial();
  }, [id, user, previewMaterial]);

  if (error) {
     return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Không thể truy cập học liệu</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => navigate('/materials')}>
                    Quay lại danh sách
                </Button>
            </div>
        </div>
     )
  }

  if (!material) {
      return (
          <div className="min-h-screen bg-background flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
      )
  }

  const isOwner = String(material.authorId) === String(user?.id || '');
  const needsPurchase = material.price > 0 && !material.isPurchased && !isOwner;

  const handleLike = async () => {
    setIsLiked(!isLiked);
    setMaterial({
      ...material,
      likes: isLiked ? material.likes - 1 : material.likes + 1,
    });
    try {
      const folderId = Number(id);
      if (!Number.isNaN(folderId)) {
        if (isLiked) await exerciseService.unlikeFolder(folderId);
        else await exerciseService.likeFolder(folderId);
      }
    } catch {}
    toast.success(isLiked ? 'Đã bỏ thích' : 'Đã thích học liệu này');
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      const folderId = Number(id);
      const res = await exerciseService.addComment(folderId, { content: commentText });
      const c = res.metaData;
      const newComment: Comment = {
        id: String(c.id),
        userId: String(c.userId),
        userName: c.username,
        content: c.content,
        createdAt: c.createdAt,
      };
      setMaterial({ ...material, comments: [newComment, ...material.comments] });
      setCommentText('');
      toast.success('Đã thêm nhận xét');
    } catch (e: any) {
      toast.error(e?.message || 'Thêm nhận xét thất bại');
    }
  };

  const handleReport = (reason: string) => {
    if (!reason) {
      toast.error('Vui lòng chọn lý do báo cáo');
      return;
    }
    toast.success('Đã gửi báo cáo vi phạm. Admin sẽ xem xét trong thời gian sớm nhất.');
  };

  const handlePurchase = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await paymentService.createOrder(Number(material.id));
      const { order, orderUrl } = res.metaData;

      if (material.price === 0) {
        // Free material
        setMaterial({ ...material, isPurchased: true });
        setShowPayment(false);
        toast.success('Đăng ký học liệu miễn phí thành công!');
      } else if (orderUrl) {
        // Paid material - redirect to VNPay
        window.location.assign(orderUrl);
      } else {
         toast.error('Không tìm thấy đường dẫn thanh toán. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Purchase failed', error);
      toast.error('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  const handleCancelOrder = async () => {
      if (!pendingOrder) return;
      try {
          await paymentService.cancelOrder(pendingOrder.id);
          setPendingOrder(null);
          toast.success('Đã hủy đơn hàng chờ thanh toán.');
      } catch (error) {
          console.error('Cancel order failed', error);
          toast.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
      }
  };

  const handleStartFlashcards = () => {
    if (needsPurchase) {
      setShowPayment(true);
      return;
    }
    navigate(`/materials/${id}/flashcards`);
  };

  const handleStartQuiz = () => {
    if (needsPurchase) {
      setShowPayment(true);
      return;
    }
    navigate(`/materials/${id}/quiz`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/materials')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl">{material.title}</h1>
              <Badge variant="secondary" className="gap-1">
                <Code className="w-3 h-3" />
                {material.code}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {(material.authorName?.[0] || '?').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{material.authorEmail}</span>
              </div>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {material.views} lượt xem
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/materials/${id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      Xoá
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Bạn có chắc muốn xoá học liệu?</AlertDialogTitle>
      <AlertDialogDescription>
        Hành động này không thể hoàn tác. Tất cả flashcards và quizzes sẽ bị xoá vĩnh viễn.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Huỷ</AlertDialogCancel>
      <AlertDialogAction
      className="bg-red-600 hover:bg-red-700"
        onClick={async () => {
          try {
            const folderId = Number(id);
            if (!Number.isNaN(folderId)) {
              await exerciseService.deleteFolder(folderId);
              toast.success("Đã xoá học liệu");
              navigate("/materials");
            }
          } catch (e: any) {
            toast.error(e?.message || "Xoá học liệu thất bại");
          }
        }}
      >
        Xoá
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

              </>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Báo cáo vi phạm
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Báo cáo vi phạm</DialogTitle>
                    <DialogDescription>
                      Vui lòng chọn lý do báo cáo học liệu này
                    </DialogDescription>
                  </DialogHeader>
                  <RadioGroup value={reportReason} onValueChange={setReportReason}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spam" id="spam" />
                      <Label htmlFor="spam">Spam hoặc quảng cáo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inappropriate" id="inappropriate" />
                      <Label htmlFor="inappropriate">Nội dung không phù hợp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="copyright" id="copyright" />
                      <Label htmlFor="copyright">Vi phạm bản quyền</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="misleading" id="misleading" />
                      <Label htmlFor="misleading">Thông tin sai lệch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Khác</Label>
                    </div>
                  </RadioGroup>
                  <DialogFooter>
                    <Button onClick={() => handleReport(reportReason)}>
                      Gửi báo cáo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button
              variant={isLiked ? 'default' : 'outline'}
              onClick={handleLike}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {material.likes}
            </Button>
          </div>
        </div>

        {/* Price & Status */}
        {material.price > 0 && !isOwner && (
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-3">
                {needsPurchase ? (
                  <>
                    <Lock className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-semibold">Học liệu có phí</p>
                      <p className="text-sm text-muted-foreground">
                        Mua để truy cập toàn bộ nội dung
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Play className="w-8 h-8 text-success" />
                    <div>
                      <p className="font-semibold text-success">Đã mua học liệu</p>
                      <p className="text-sm text-muted-foreground">
                        Bạn có thể truy cập toàn bộ nội dung
                      </p>
                    </div>
                  </>
                )}
              </div>
              {needsPurchase && (
                <div className="flex gap-2">
                   {pendingOrder ? (
                        <div className="flex items-center gap-2">
                             <div className="text-right mr-2">
                                <p className="font-semibold text-yellow-600">Đơn hàng đang chờ</p>
                                <p className="text-xs text-muted-foreground">Vui lòng hoàn tất thanh toán</p>
                             </div>
                             <Button variant="outline" size="lg" onClick={handleCancelOrder}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Hủy đơn
                             </Button>
                             <Button size="lg" onClick={() => window.location.assign(pendingOrder.orderUrl || '')} disabled={!pendingOrder.orderUrl}>
                                <Clock className="w-4 h-4 mr-2" />
                                Thanh toán tiếp
                             </Button>
                        </div>
                   ) : (
                    <Button size="lg" onClick={() => setShowPayment(true)}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mua ngay - {material.price.toLocaleString()}đ
                    </Button>
                   )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {material.description && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mô tả</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{material.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Content Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {material.flashcards.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartFlashcards}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Thẻ ghi nhớ</h3>
                  <p className="text-sm text-muted-foreground">
                    {material.flashcards.length} thẻ
                  </p>
                </div>
                {needsPurchase && <Lock className="w-5 h-5 text-muted-foreground" />}
              </CardContent>
            </Card>
          )}

          {material.quizzes.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartQuiz}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Play className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Làm test</h3>
                  <p className="text-sm text-muted-foreground">
                    {material.quizzes.length} câu hỏi
                  </p>
                </div>
                {needsPurchase && <Lock className="w-5 h-5 text-muted-foreground" />}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Nhận xét ({material.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Textarea
                placeholder="Viết nhận xét của bạn..."
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button onClick={handleComment} disabled={!commentText.trim()}>
                Gửi nhận xét
              </Button>
            </div>

            <Separator />

            {/* Comments List */}
            {material.comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Chưa có nhận xét nào
              </p>
            ) : (
              <div className="space-y-4">
                {material.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {comment.userName?.[0] || '?'.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thanh toán học liệu</DialogTitle>
              <DialogDescription>
                Hoàn tất thanh toán để truy cập học liệu
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span>Học liệu:</span>
                <span className="font-semibold">{material.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Giá:</span>
                <span className="text-xl font-semibold text-primary">
                  {material.price.toLocaleString()}đ
                </span>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                * Sau khi thanh toán, bạn sẽ có quyền truy cập vĩnh viễn vào học liệu này.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPayment(false)} disabled={isProcessingPayment}>
                Hủy
              </Button>
              <Button onClick={handlePurchase} disabled={isProcessingPayment}>
                {isProcessingPayment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận thanh toán
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
