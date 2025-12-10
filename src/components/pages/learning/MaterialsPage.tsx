import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Plus, Lock, Unlock, Heart, Eye, Code, FolderOpen } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Badge } from '../../ui/badge';
import { Avatar, AvatarFallback } from '../../ui/avatar';
import { useAuthStore } from '../../../utils/authStore';
import type { Material } from '../../../types';
import { exerciseService } from '../../../services/exerciseService';
import { useEffect } from 'react';

const mockMaterials: Material[] = [];

export function MaterialsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('public');
  const [serverFolders, setServerFolders] = useState<any[]>([]);

  useEffect(() => {
    exerciseService.getFolders({ page: 1, limit: 20 })
      .then((res) => setServerFolders(res.metaData.folders || []))
      .catch(() => setServerFolders([]));
  }, []);

  // Filter materials based on tab
  const publicMaterials = serverFolders
    .filter((f: any) => f.isPublic == true)
    .map((f: any)  => ({
      id: String(f.id),
      code: f.code || '',
      title: f.name,
      description: '',
      authorId: String(f.createdBy?.id || ''),
      authorName: f.createdBy?.username || '',
      authorEmail: f.createdBy?.email || '',
      isPublic: !!f.isPublic,
      price: Number(f.price) || 0,
      flashcards: [],
      quizzes: [],
      likes: f.voteCount || 0,
      views: f.totalAttemptCount || 0,
      comments: [],
      createdAt: f.createdAt,
      updatedAt: f.createdAt,
    } as Material));
  const myMaterials = serverFolders
    .filter((f: any)  => String(f.createdBy?.id) === String(user?.id))
    .map((f: any)  => ({
      id: String(f.id),
      code: f.code || '',
      title: f.name,
      description: '',
      authorId: String(f.createdBy?.id || ''),
      authorName: f.createdBy?.username || '',
      authorEmail: f.createdBy?.email || '',
      isPublic: !!f.isPublic,
      price: Number(f.price) || 0,
      flashcards: [],
      quizzes: [],
      likes: f.voteCount || 0,
      views: f.totalAttemptCount || 0,
      comments: [],
      createdAt: f.createdAt,
      updatedAt: f.createdAt,
    } as Material));
  const serverPublic = serverFolders.filter((f: any)  => f.author?.id !== user?.id).map(f => ({
    id: String(f.id),
    code: '',
    title: f.name,
    description: f.description || '',
    authorId: String(f.author?.id || ''),
    authorName: f.author?.name || '',
    authorEmail: '',
    isPublic: true,
    price: 0,
    flashcards: [],
    quizzes: (f.quizzes || []).map((q: any) => ({ id: String(q.id), term: q.title, definition: '' })),
    likes: f.voteCount || 0,
    views: f.viewCount || 0,
    comments: [],
    createdAt: f.createdAt,
    updatedAt: f.createdAt,
  } as Material));

  // Filter by search
  const filterMaterials = (materials: Material[]) => {
    if (!searchQuery) return materials;
    const query = searchQuery.toLowerCase();
    return materials.filter(
      m => 
        m.title.toLowerCase().includes(query) || 
        m.code.toLowerCase().includes(query) ||
        m.authorName.toLowerCase().includes(query)
    );
  };

  const displayPublic = filterMaterials(publicMaterials);
  const displayMy = filterMaterials(myMaterials);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-2">Học liệu</h1>
          <p className="text-muted-foreground">
            Khám phá và tạo các bộ học liệu của riêng bạn
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6 gap-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="public">Chung</TabsTrigger>
              <TabsTrigger value="my">Học liệu của tôi</TabsTrigger>
            </TabsList>
            <Button
              onClick={() => navigate('/materials/create')}
              className="h-10 gap-2 shrink-0"
            >
              <Plus className="w-5 h-5" />
              Tạo mới
            </Button>
          </div>

          {/* Public Materials Tab */}
          <TabsContent value="public" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm học liệu hoặc nhập mã code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Materials Grid */}
            {displayPublic.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không tìm thấy học liệu nào</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayPublic.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Materials Tab */}
          <TabsContent value="my" className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm trong học liệu của bạn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Materials Grid */}
            {displayMy.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2">Chưa có học liệu nào</h3>
                <p className="text-muted-foreground mb-4">
                  Tạo học liệu đầu tiên của bạn để chia sẻ kiến thức
                </p>
                <Button onClick={() => navigate('/materials/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo học liệu mới
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayMy.map((material) => (
                  <MaterialCard key={material.id} material={material} isOwner />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface MaterialCardProps {
  material: Material;
  isOwner?: boolean;
}

function MaterialCard({ material, isOwner }: MaterialCardProps) {
  const navigate = useNavigate();
  const flashcardsCount = material.flashcards.length;
  const quizzesCount = material.quizzes.length;

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/materials/${material.id}`)}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{material.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs">
                  {(material.authorName?.[0] || '?').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{material.authorEmail}</span>
            </CardDescription>
          </div>
          {isOwner && (
            <Badge variant="outline" className="ml-2">Của tôi</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <Code className="w-3 h-3 mr-1" />
            {material.code}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {flashcardsCount + quizzesCount} từ vựng
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            {material.isPublic ? (
              <Unlock className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>{material.price === 0 ? 'Miễn phí' : `${material.price.toLocaleString()} đồng`}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {material.likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {material.views}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Lượt tham gia: {material.views}</span>
        <span>{material.comments.length} nhận xét</span>
      </CardFooter>
    </Card>
  );
}
