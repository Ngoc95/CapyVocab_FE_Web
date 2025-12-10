import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { PostCard } from '../../community/PostCard';
import { CreatePostBox } from '../../community/CreatePostBox';
import { FloatingActionMenu } from '../../community/FloatingActionMenu';
import { CreatePostDialog } from '../../community/CreatePostDialog';
import { EditPostDialog } from '../../community/EditPostDialog';
import { PostHistoryDialog } from '../../community/PostHistoryDialog';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { toast } from 'sonner';
import { useAuthStore } from '../../../utils/authStore';
import { postService } from '../../../services/postService';

const mockPosts: Post[] = [];

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

export function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHashtag, setFilterHashtag] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState<string | null>(null);
  const { user } = useAuthStore();
  const currentUserId = String(user?.id || '0');

  useEffect(() => {
    postService.getPosts({ page: 1, limit: 20 })
      .then((res) => {
        const apiPosts = res.metaData.posts.map((p) => ({
          id: String(p.id),
          user: { id: String(p.createdBy.id), name: p.createdBy.username, avatar: p.createdBy.avatar || '' },
          content: p.content,
          hashtags: p.tags || [],
          images: p.thumbnails || [],
          likes: p.voteCount || 0,
          comments: p.commentCount || 0,
          timestamp: p.createdAt,
          isLiked: !!p.isAlreadyVote,
        }));
        setPosts(apiPosts);
      })
      .catch((e: any) => {
        toast.error(e?.message || 'Tải danh sách bài viết thất bại');
        setPosts([]);
      });
  }, []);

  // Filtered posts based on search query and filters
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by hashtag
      if (filterHashtag && !post.hashtags.includes(filterHashtag)) {
        return false;
      }

      // Filter by user
      if (filterUserId && post.user.id !== filterUserId) {
        return false;
      }

      // Search in content and hashtags
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const contentMatch = post.content.toLowerCase().includes(query);
        const hashtagMatch = post.hashtags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        const userMatch = post.user.name.toLowerCase().includes(query);
        
        return contentMatch || hashtagMatch || userMatch;
      }

      return true;
    });
  }, [posts, searchQuery, filterHashtag, filterUserId]);

  const handleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
    try {
      const numericId = Number(postId);
      if (!Number.isNaN(numericId)) {
        const target = posts.find(p => p.id === postId);
        if (target?.isLiked) await postService.unlikePost(numericId);
        else await postService.likePost(numericId);
      }
    } catch {}
  };

  const handleCreatePost = async (content: string, images: File[]) => {
    try {
      const urls = images.length ? await postService.uploadImages(images) : [];
      await postService.createPost({ content, thumbnails: urls, tags: [] });
      const res = await postService.getPosts({ page: 1, limit: 20 });
      const apiPosts = res.metaData.posts.map((p) => ({
        id: String(p.id),
        user: { id: String(p.createdBy.id), name: p.createdBy.username, avatar: p.createdBy.avatar || '' },
        content: p.content,
        hashtags: p.tags || [],
        images: p.thumbnails || [],
        likes: p.voteCount || 0,
        comments: p.commentCount || 0,
        timestamp: p.createdAt,
        isLiked: !!p.isAlreadyVote,
      }));
      setPosts(apiPosts);
      toast.success('Đã tạo bài đăng mới');
      setIsCreatePostOpen(false);
    } catch (e: any) {
      toast.error(e?.message || 'Tạo bài đăng thất bại');
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditPostOpen(true);
  };

  const handleUpdatePost = async (postId: string, content: string, hashtags: string[], newImages: File[], existingImages: string[]) => {
    try {
      const numericId = Number(postId);
      const uploaded = newImages.length ? await postService.uploadImages(newImages) : [];
      const thumbnails = [...(existingImages || []), ...uploaded];
      const res = await postService.updatePost(numericId, { content, thumbnails, tags: hashtags });
      const p = res.metaData;
      setPosts(prev => prev.map(post => post.id === postId ? {
        id: String(p.id),
        user: { id: String(p.createdBy.id), name: p.createdBy.username, avatar: p.createdBy.avatar || '' },
        content: p.content,
        hashtags: p.tags || [],
        images: p.thumbnails || [],
        likes: p.voteCount || 0,
        comments: p.commentCount || 0,
        timestamp: p.createdAt,
        isLiked: !!p.isAlreadyVote,
      } : post));
      toast.success('Đã cập nhật bài đăng');
      setIsEditPostOpen(false);
      setEditingPost(null);
    } catch (e: any) {
      toast.error(e?.message || 'Cập nhật bài đăng thất bại');
    }
  };

  const handleDeletePost = (postId: string) => {
    setDeletePostId(postId);
  };

  const confirmDeletePost = async () => {
    if (!deletePostId) return;
    try {
      const numericId = Number(deletePostId);
      await postService.deletePost(numericId);
      setPosts(prev => prev.filter(post => post.id !== deletePostId));
      toast.success('Đã xóa bài đăng');
    } catch (e: any) {
      toast.error(e?.message || 'Xóa bài đăng thất bại');
    } finally {
      setDeletePostId(null);
    }
  };

  const handleReportPost = (postId: string) => {
    setReportPostId(postId);
  };

  const confirmReportPost = () => {
    if (reportPostId) {
      toast.success('Đã gửi báo cáo vi phạm');
      setReportPostId(null);
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    setFilterHashtag(hashtag);
    setFilterUserId(null);
    setSearchQuery('');
  };

  const handleUserClick = (userId: string) => {
    setFilterUserId(userId);
    setFilterHashtag(null);
    setSearchQuery('');
  };

  const clearFilters = () => {
    setFilterHashtag(null);
    setFilterUserId(null);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content - Feed */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border-gray-300 focus:border-[#1AB1F6] focus:ring-[#1AB1F6]"
            />
          </div>
        </div>

        {/* Create Post Box */}
        <CreatePostBox 
          onClick={() => setIsCreatePostOpen(true)}
          userAvatar="https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop"
          userName="User001"
        />

        {/* Active Filters */}
        {(filterHashtag || filterUserId) && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Lọc:</span>
            {filterHashtag && (
              <Badge 
                variant="secondary" 
                className="bg-[#1AB1F6] text-white hover:bg-[#1599d6] cursor-pointer"
                onClick={clearFilters}
              >
                {filterHashtag} ✕
              </Badge>
            )}
            {filterUserId && (
              <Badge 
                variant="secondary" 
                className="bg-[#1AB1F6] text-white hover:bg-[#1599d6] cursor-pointer"
                onClick={clearFilters}
              >
                {posts.find(p => p.user.id === filterUserId)?.user.name} ✕
              </Badge>
            )}
          </div>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                onReport={handleReportPost}
                onHashtagClick={handleHashtagClick}
                onUserClick={handleUserClick}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy bài viết nào</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-[#1AB1F6] hover:underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Menu */}
      <FloatingActionMenu
        onCreatePost={() => setIsCreatePostOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Dialogs */}
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
        onSubmit={handleCreatePost}
      />

      <EditPostDialog
        open={isEditPostOpen}
        onOpenChange={setIsEditPostOpen}
        onSubmit={handleUpdatePost}
        post={editingPost}
      />

      <PostHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        posts={posts.filter(p => p.user.id === currentUserId)}
        onEdit={handleEditPost}
        onDelete={handleDeletePost}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài đăng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePost}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Report Confirmation Dialog */}
      <AlertDialog open={!!reportPostId} onOpenChange={() => setReportPostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Báo cáo vi phạm</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn báo cáo bài đăng này vi phạm quy định cộng đồng?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReportPost}
              className="bg-[#1AB1F6] hover:bg-[#1599d6]"
            >
              Gửi báo cáo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
