import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (content: string, images: File[]) => void;
}

export function CreatePostDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreatePostDialogProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 10) {
      alert('Bạn chỉ có thể tải lên tối đa 10 hình ảnh');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài đăng');
      return;
    }

    onSubmit(content, images);
    
    // Reset form
    setContent('');
    setImages([]);
    setPreviewUrls([]);
  };

  const handleClose = () => {
    setContent('');
    setImages([]);
    setPreviewUrls([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo bài đăng mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-900">User001</p>
            </div>
          </div>

          {/* Content Input */}
          <Textarea
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />

          {/* Image Previews */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={images.length >= 10}
              />
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ImageIcon className="w-5 h-5 text-[#1AB1F6]" />
                <span className="text-sm text-gray-700">Thêm hình ảnh</span>
                <span className="text-xs text-gray-500">
                  ({images.length}/10)
                </span>
              </div>
            </label>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#1AB1F6] hover:bg-[#1599d6]"
              >
                Đăng bài
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}