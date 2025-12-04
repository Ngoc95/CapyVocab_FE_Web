import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { ScrollArea } from '../../ui/scroll-area';
import { ImageViewer } from '../../community/ImageViewer';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

// Mock data - should match the post from community
const mockPost = {
  id: '1',
  user: {
    id: 'user001',
    name: 'User001',
    email: 'User001@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
  },
  content: 'advanced: tu moi nay hay ne',
  hashtags: ['#ahihi'],
  images: [
    'figma:asset/0c10484aceec240cc479b8116f5b098606ee1d57.png',
    'figma:asset/0c10484aceec240cc479b8116f5b098606ee1d57.png',
    'figma:asset/0c10484aceec240cc479b8116f5b098606ee1d57.png',
    'figma:asset/0c10484aceec240cc479b8116f5b098606ee1d57.png',
    'figma:asset/0c10484aceec240cc479b8116f5b098606ee1d57.png',
  ],
  likes: 2,
  comments: 1,
  timestamp: '03/07/2025 22:32',
  isLiked: true,
};

const mockComments: Comment[] = [
  {
    id: 'c1',
    userId: 'user001',
    userName: 'User001',
    avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
    content: 'vui vay',
    timestamp: '03/07/2025 22:34',
    likes: 1,
    isLiked: false,
    replies: [
      {
        id: 'c1-r1',
        userId: 'user002',
        userName: 'User002',
        avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
        content: 'đúng vậy!',
        timestamp: '03/07/2025 22:35',
        likes: 0,
        isLiked: false,
        replies: [],
      },
    ],
  },
  {
    id: 'c2',
    userId: 'user001',
    userName: 'User001',
    avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
    content: 'hehehe',
    timestamp: '03/07/2025 22:34',
    likes: 2,
    isLiked: true,
    replies: [],
  },
  {
    id: 'c3',
    userId: 'user001',
    userName: 'User001',
    avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
    content: 'ahihi',
    timestamp: '03/07/2025 22:34',
    likes: 0,
    isLiked: false,
    replies: [],
  },
];

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; userName: string } | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          };
        }
        
        // Handle replies
        if (parentId && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                };
              }
              return reply;
            }),
          };
        }
        
        return comment;
      });
    });
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    if (replyingTo) {
      // Add reply to comment
      const newReply: Comment = {
        id: `r${Date.now()}`,
        userId: 'user001',
        userName: 'User001',
        avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
        content: commentText,
        timestamp: new Date().toLocaleString('vi-VN'),
        likes: 0,
        isLiked: false,
        replies: [],
      };

      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === replyingTo.id
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      setReplyingTo(null);
    } else {
      // Add new top-level comment
      const newComment: Comment = {
        id: `c${Date.now()}`,
        userId: 'user001',
        userName: 'User001',
        avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
        content: commentText,
        timestamp: new Date().toLocaleString('vi-VN'),
        likes: 0,
        isLiked: false,
        replies: [],
      };

      setComments(prev => [...prev, newComment]);
      setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
    }

    setCommentText('');
  };

  const formatContent = (content: string, hashtags: string[]) => {
    let formattedContent = content;
    
    hashtags.forEach(tag => {
      const regex = new RegExp(tag, 'g');
      formattedContent = formattedContent.replace(
        regex,
        `<span class="text-[#1AB1F6]">${tag}</span>`
      );
    });

    return formattedContent;
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const renderImages = () => {
    if (post.images.length === 0) return null;

    if (post.images.length === 1) {
      return (
        <div className="mt-3">
          <ImageWithFallback
            src={post.images[0]}
            alt="Post image"
            className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(0)}
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
              onClick={() => handleImageClick(index)}
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
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      );
    }

    // 4 or more images
    return (
      <div className="mt-3 grid grid-cols-2 gap-2">
        {post.images.slice(0, 3).map((img, index) => (
          <ImageWithFallback
            key={index}
            src={img}
            alt={`Post image ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(index)}
          />
        ))}
        <div 
          className="relative w-full h-32 rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => handleImageClick(3)}
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

  const renderComment = (comment: Comment, isReply: boolean = false, parentId?: string) => {
    return (
      <div key={comment.id} className={isReply ? 'ml-12' : ''}>
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={comment.avatar} alt={comment.userName} />
            <AvatarFallback>{comment.userName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <p className="font-medium text-sm text-gray-900 break-words">{comment.userName}</p>
              <p className="text-gray-900 break-words">{comment.content}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-2 flex-wrap">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                {comment.timestamp}
              </button>
              <button
                onClick={() => handleLikeComment(comment.id, isReply, parentId)}
                className={`text-xs hover:text-[#1AB1F6] flex items-center gap-1 ${
                  comment.isLiked ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500' : ''}`} />
                {comment.likes > 0 && <span>{comment.likes}</span>}
              </button>
              {!isReply && (
                <button
                  onClick={() => setReplyingTo({ id: comment.id, userName: comment.userName })}
                  className="text-xs text-gray-500 hover:text-[#1AB1F6]"
                >
                  Trả lời
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Render replies */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {comment.replies.map(reply => renderComment(reply, true, comment.id))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4">
          {/* Post Content */}
          <div className="mb-4">
            <p
              className="text-gray-900 break-words mb-3"
              dangerouslySetInnerHTML={{
                __html: formatContent(post.content, post.hashtags),
              }}
            />
            {renderImages()}
          </div>

          {/* Like and Stats Row */}
          <div className="mb-6 pb-4 border-b flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.isLiked
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart
                className={`w-6 h-6 ${post.isLiked ? 'fill-red-500' : ''}`}
              />
              <span className="text-sm">{post.likes}</span>
            </button>
            <span className="text-sm text-[#1AB1F6]">
              {post.comments} trả lời
            </span>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 mb-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        </div>
      </ScrollArea>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder={replyingTo ? `Trả lời ${replyingTo.userName}` : "Nhập bình luận..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            className="flex-1"
          />
          {replyingTo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="text-[#1AB1F6] hover:text-[#1599d6]"
            >
              Hủy
            </Button>
          )}
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="bg-[#1AB1F6] hover:bg-[#1599d6] flex-shrink-0"
          >
            <Send className="w-5 h-5" />
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
    </div>
  );
}