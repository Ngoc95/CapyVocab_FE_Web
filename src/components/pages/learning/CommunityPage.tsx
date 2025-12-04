import { useState, useMemo } from 'react';
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
import { toast } from 'sonner@2.0.3';

// Mock data for posts
const mockPosts = [
  {
    id: '1',
    user: {
      id: 'user001',
      name: 'User001',
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
    likes: 0,
    comments: 0,
    timestamp: '03/07/2025 22:32',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      id: 'user001',
      name: 'User001',
      avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
    },
    content: 'Greenwashing: tay xanh. Đây là một từ vựng rất hay và thú vị mà tôi vừa mới học được hôm nay. Nó có ý nghĩa là việc một công ty hay tổ chức làm ra vẻ họ quan tâm đến môi trường nhưng thực tế họ không làm gì cả. Rất phù hợp để mô tả nhiều tình huống trong cuộc sống hiện đại của chúng ta.',
    hashtags: ['#vocabulary', '#english'],
    images: [],
    likes: 2,
    comments: 1,
    timestamp: '03/07/2025 22:19',
    isLiked: true,
  },
  {
    id: '3',
    user: {
      id: 'user002',
      name: 'User002',
      avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
    },
    content: 'Học từ vựng hôm nay thật là vui! #CapyVocab #LearningEnglish',
    hashtags: ['#CapyVocab', '#LearningEnglish'],
    images: [],
    likes: 5,
    comments: 2,
    timestamp: '03/07/2025 21:45',
    isLiked: false,
  },
];

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
  const [posts, setPosts] = useState(mockPosts);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHashtag, setFilterHashtag] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState<string | null>(null);

  const currentUserId = 'user001'; // Mock current user

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

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCreatePost = (content: string, images: File[]) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: {
        id: currentUserId,
        name: 'User001',
        avatar: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=100&h=100&fit=crop',
      },
      content,
      hashtags: [], // Extract hashtags from content if needed
      images: [], // In real app, would upload and get URLs
      likes: 0,
      comments: 0,
      timestamp: new Date().toLocaleString('vi-VN'),
      isLiked: false,
    };

    setPosts(prev => [newPost, ...prev]);
    toast.success('Đã tạo bài đăng mới');
    setIsCreatePostOpen(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditPostOpen(true);
  };

  const handleUpdatePost = (postId: string, content: string, hashtags: string[], images: File[]) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              content,
              hashtags,
              // In real app, would handle image updates
            }
          : post
      )
    );
    toast.success('Đã cập nhật bài đăng');
    setIsEditPostOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: string) => {
    setDeletePostId(postId);
  };

  const confirmDeletePost = () => {
    if (deletePostId) {
      setPosts(prev => prev.filter(post => post.id !== deletePostId));
      toast.success('Đã xóa bài đăng');
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
