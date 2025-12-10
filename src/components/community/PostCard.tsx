import { useState } from 'react';
import { Heart, MoreVertical, Edit, Trash2, Flag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ImageViewer } from './ImageViewer';

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

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
  currentUserId?: string;
  onHashtagClick?: (hashtag: string) => void;
  onUserClick?: (userId: string) => void;
  isDetailView?: boolean;
}

export function PostCard({ 
  post, 
  onLike, 
  onEdit, 
  onDelete, 
  onReport,
  currentUserId = 'user001', // Default current user
  onHashtagClick,
  onUserClick,
  isDetailView = false,
}: PostCardProps) {
  const navigate = useNavigate();
  const isOwnPost = post.user.id === currentUserId;
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const MAX_CONTENT_LENGTH = 200;
  const shouldTruncate = !isDetailView && post.content.length > MAX_CONTENT_LENGTH;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.slice(0, MAX_CONTENT_LENGTH) + '...' 
    : post.content;

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    if (post.images.length === 1) {
      return (
        <div className="mt-3">
          <ImageWithFallback
            src={post.images[0]}
            alt="Post image"
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => handleImageClick(0, e)}
          />
        </div>
      );
    }

    if (post.images.length === 2) {
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {post.images.map((img, index) => (
            <ImageWithFallback
              key={index}
              src={img}
              alt={`Post image ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(index, e)}
            />
          ))}
        </div>
      );
    }

    if (post.images.length === 3) {
      return (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {post.images.map((img, index) => (
            <ImageWithFallback
              key={index}
              src={img}
              alt={`Post image ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => handleImageClick(index, e)}
            />
          ))}
        </div>
      );
    }

    // 4 or more images - show first 3 and a +N overlay on the 4th
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {post.images.slice(0, 3).map((img, index) => (
          <ImageWithFallback
            key={index}
            src={img}
            alt={`Post image ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={(e) => handleImageClick(index, e)}
          />
        ))}
        <div 
          className="relative w-full h-32 rounded-lg overflow-hidden cursor-pointer group"
          onClick={(e) => handleImageClick(3, e)}
        >
          <ImageWithFallback
            src={post.images[3]}
            alt={`Post image 4`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center group-hover:bg-black/70 transition-colors">
            <span className="text-white text-2xl">+{post.images.length - 3}</span>
          </div>
        </div>
      </div>
    );
  };

  const formatContent = (content: string, hashtags: string[]) => {
    let formattedContent = content;
    
    // Replace hashtags in content with clickable styled spans
    hashtags.forEach(tag => {
      const regex = new RegExp(tag, 'g');
      formattedContent = formattedContent.replace(
        regex,
        `<span class="text-[#1AB1F6] cursor-pointer hover:underline" data-hashtag="${tag}">${tag}</span>`
      );
    });

    return formattedContent;
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const hashtag = target.getAttribute('data-hashtag');
    
    if (hashtag && onHashtagClick) {
      e.stopPropagation();
      onHashtagClick(hashtag);
    }
  };

  const handleUserNameClick = (e: React.MouseEvent) => {
    if (onUserClick) {
      e.stopPropagation();
      onUserClick(post.user.id);
    }
  };

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('[role="button"]') ||
      target.closest('a')
    ) {
      return;
    }
    navigate(`/community/${post.id}`);
  };
  
  return (
    <>
      <div 
        className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={handlePostClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar 
              className="w-10 h-10 cursor-pointer" 
              onClick={handleUserNameClick}
            >
              <AvatarImage src={post.user.avatar} alt={post.user.name[0]} />
              <AvatarFallback>{post.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p 
                className="text-gray-900 cursor-pointer hover:underline" 
                onClick={handleUserNameClick}
              >
                {post.user.name}
              </p>
              <p className="text-xs text-gray-500">{post.timestamp}</p>
            </div>
          </div>
          
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost ? (
                <>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(post); }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(post.id); }}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReport?.(post.id); }}>
                  <Flag className="w-4 h-4 mr-2" />
                  Báo cáo vi phạm
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="mb-3">
          <p
            className="text-gray-900 break-words"
            dangerouslySetInnerHTML={{
              __html: formatContent(displayContent, post.hashtags),
            }}
            onClick={handleContentClick}
          />
          {shouldTruncate && !isExpanded && (
            <button
              className="text-[#1AB1F6] hover:underline mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              Xem thêm
            </button>
          )}
        </div>

        {/* Images */}
        {renderImages()}

        {/* Stats */}
        <div className="mt-3 mb-3">
          <p className="text-sm text-[#1AB1F6]">
            {post.likes} lượt thích, {post.comments} trả lời
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike(post.id);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
              post.isLiked
                ? 'text-red-500 hover:bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${post.isLiked ? 'fill-red-500' : ''}`}
            />
          </button>

          <Button
            variant="outline"
            size="sm"
            className="border-[#1AB1F6] text-[#1AB1F6] hover:bg-[#1AB1F6] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/community/${post.id}`);
            }}
          >
            TRẢ LỜI
          </Button>
        </div>
      </div>

      {/* Image Viewer */}
      <ImageViewer
        images={post.images}
        initialIndex={selectedImageIndex}
        open={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </>
  );
}
