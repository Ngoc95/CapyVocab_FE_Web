import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface Post {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  hashtags: string[];
  images: string[];
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (postId: string, content: string, hashtags: string[], images: File[]) => void;
  post: Post | null;
}

export function EditPostDialog({
  open,
  onOpenChange,
  onSubmit,
  post,
}: EditPostDialogProps) {
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (post) {
      // Extract content without hashtags
      let cleanContent = post.content;
      post.hashtags.forEach(tag => {
        cleanContent = cleanContent.replace(tag, '').trim();
      });
      setContent(cleanContent);
      setHashtags(post.hashtags);
      setExistingImages(post.images);
    }
  }, [post]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = images.length + existingImages.length;
    
    if (files.length + totalImages > 3) {
      alert('Bạn chỉ có thể có tối đa 3 hình ảnh');
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

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.startsWith('#') ? tagInput : `#${tagInput}`;
    if (!hashtags.includes(newTag)) {
      setHashtags(prev => [...prev, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setHashtags(prev => prev.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài đăng');
      return;
    }

    if (post) {
      onSubmit(post.id, content, hashtags, images);
    }
    
    handleClose();
  };

  const handleClose = () => {
    setContent('');
    setHashtags([]);
    setTagInput('');
    setImages([]);
    setPreviewUrls([]);
    setExistingImages([]);
    onOpenChange(false);
  };

  const totalImages = existingImages.length + images.length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sửa bài viết</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hashtag Input */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Nhập tag...</label>
            <div className="flex gap-2">
              <Input
                placeholder="ahihi"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1"
              />
            </div>
            
            {/* Hashtag Badges */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map(tag => (
                  <Badge
                    key={tag}
                    className="bg-[#1AB1F6] hover:bg-[#1599d6] text-white px-3 py-1 gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Content Input */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Nội dung bài viết</label>
            <Textarea
              placeholder="Advanced: tu moi nay hay ne"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] resize-none border-2"
            />
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Existing Images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group aspect-square">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}

            {/* New Images */}
            {previewUrls.map((url, index) => (
              <div key={`new-${index}`} className="relative group aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            ))}

            {/* Add Image Button */}
            {totalImages < 3 && (
              <label className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-gray-500" />
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#1AB1F6] hover:bg-[#1599d6]"
            >
              Xong
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
