import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Heart, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { ScrollArea } from '../../ui/scroll-area';
import { ImageViewer } from '../../community/ImageViewer';
import { postService } from '../../../services/postService';
import type { CommentItem } from '../../../services/exerciseService';
import { toast } from 'sonner';
import { useAuthStore } from '../../../utils/authStore';

const emptyComments: CommentItem[] = [];

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [post, setPost] = useState({
    id: String(postId || ''),
    user: { id: '0', name: '', email: '', avatar: '' },
    content: '',
    hashtags: [] as string[],
    images: [] as string[],
    likes: 0,
    comments: 0,
    timestamp: '',
    isLiked: false,
  });
  const [selectedPostComment, setSelectedPostComment] = useState<CommentItem[]>(emptyComments);
  const [childComment, setChildComment] = useState<Map<number, CommentItem[]>>(new Map());
  const [commentText, setCommentText] = useState('');
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null);
  const [isCreateChildComment, setIsCreateChildComment] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const numericId = Number(postId);
        if (Number.isNaN(numericId)) return;
        const res = await postService.getPostById(numericId);
        const p = res.metaData;
        setPost({
          id: String(p.id),
          user: { id: String(p.createdBy.id), name: p.createdBy.username, email: p.createdBy.email || '', avatar: p.createdBy.avatar || '' },
          content: p.content,
          hashtags: p.tags || [],
          images: p.thumbnails || [],
          likes: p.voteCount || 0,
          comments: p.commentCount || 0,
          timestamp: p.createdAt,
          isLiked: !!p.isAlreadyVote,
        });
        setSelectedPostComment((p.comments || []) as any);
      } catch (e: any) {
        toast.error(e?.message || 'Tải bài viết thất bại');
      }
    };
    loadPost();
  }, [postId]);

  const handleLike = async () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    }));
    try {
      const numericId = Number(postId);
      if (!Number.isNaN(numericId)) {
        if (post.isLiked) await postService.unlikePost(numericId);
        else await postService.likePost(numericId);
      }
    } catch {}
  };

  const handleLikeComment = () => {};

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    try {
      const numericId = Number(postId);
      if (Number.isNaN(numericId)) return;
      const res = await postService.createComment(numericId, {
        content: commentText,
        parentId: isCreateChildComment ? selectedComment?.id ?? null : null,
      });
      const newComment = res.metaData;
      if (isCreateChildComment && selectedComment) {
        setChildComment(prev => {
          const updated = new Map(prev);
          const key = Number(selectedComment.id);
          const existing = updated.get(key) || [];
          updated.set(key, [newComment, ...existing]);
          return updated;
        });
      } else {
        setSelectedPostComment(prev => [newComment, ...prev]);
        setPost(prev => ({ ...prev, comments: prev.comments + 1 }));
      }
      setCommentText('');
      setIsCreateChildComment(false);
      setSelectedComment(null);
      toast.success('Đã thêm bình luận');
    } catch (e: any) {
      toast.error(e?.message || 'Thêm bình luận thất bại');
    }
  };

  const handleLoadChildComments = async (parentId: number) => {
    try {
      const numericPostId = Number(postId);
      const res = await postService.getChildComments(numericPostId, parentId);
      setChildComment(prev => {
        const updated = new Map(prev);
        updated.set(parentId, res.metaData || []);
        return updated;
      });
    } catch (e: any) {
      toast.error(e?.message || 'Tải trả lời thất bại');
    }
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
    if (!post.images || post.images.length === 0) return null;

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

  const renderComment = (comment: CommentItem, isReply: boolean = false, parentId?: number) => {
    return (
      <div key={comment.id} className={isReply ? 'ml-12' : ''}>
        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={comment.userAvatar || ''} alt={comment.username} />
            <AvatarFallback>{(comment.username || '').slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <p className="font-medium text-sm text-gray-900 break-words">{comment.username}</p>
              <p className="text-gray-900 break-words">{comment.content}</p>
            </div>
            <div className="flex items-center gap-3 mt-1 px-2 flex-wrap">
              <button className="text-xs text-gray-500 hover:text-gray-700">
                {comment.createdAt}
              </button>
              {!isReply && (
                <button
                  onClick={() => { setSelectedComment(comment); setIsCreateChildComment(true); }}
                  className="text-xs text-gray-500 hover:text-[#1AB1F6]"
                >
                  Trả lời
                </button>
              )}
              {!isReply && (
                <button
                  onClick={() => handleLoadChildComments(Number(comment.id))}
                  className="text-xs text-gray-500 hover:text-[#1AB1F6]"
                >
                  Xem trả lời
                </button>
              )}
            </div>
          </div>
        </div>

        {childComment.get(Number(comment.id)) && (
          <div className="mt-3 space-y-3">
            {(childComment.get(Number(comment.id)) || []).map(reply => renderComment(reply, true, Number(comment.id)))}
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
            {selectedPostComment.map(comment => renderComment(comment))}
          </div>
        </div>
      </ScrollArea>

      {/* Comment Input */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder={isCreateChildComment && selectedComment ? `Trả lời ${selectedComment.username}` : "Nhập bình luận..."}
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
          {isCreateChildComment && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsCreateChildComment(false); setSelectedComment(null); }}
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
