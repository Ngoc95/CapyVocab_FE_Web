import { useState } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Search, BookOpen, Star, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

const vocabularyTopics = [
  {
    id: 'topic-1',
    title: 'Daily Conversation',
    description: 'Common phrases for everyday situations',
    level: 'Beginner',
    wordCount: 150,
    progress: 45,
    favorite: true,
    image: '🗣️',
  },
  {
    id: 'topic-2',
    title: 'Business English',
    description: 'Professional vocabulary for the workplace',
    level: 'Intermediate',
    wordCount: 200,
    progress: 20,
    favorite: false,
    image: '💼',
  },
  {
    id: 'topic-3',
    title: 'Travel & Tourism',
    description: 'Essential words for your adventures',
    level: 'Beginner',
    wordCount: 120,
    progress: 80,
    favorite: true,
    image: '✈️',
  },
  {
    id: 'topic-4',
    title: 'Food & Cooking',
    description: 'Culinary vocabulary and expressions',
    level: 'Beginner',
    wordCount: 180,
    progress: 60,
    favorite: false,
    image: '🍳',
  },
  {
    id: 'topic-5',
    title: 'Technology & Internet',
    description: 'Modern tech terminology',
    level: 'Advanced',
    wordCount: 250,
    progress: 15,
    favorite: true,
    image: '💻',
  },
  {
    id: 'topic-6',
    title: 'Health & Fitness',
    description: 'Medical and wellness vocabulary',
    level: 'Intermediate',
    wordCount: 160,
    progress: 0,
    favorite: false,
    image: '🏥',
  },
];

const recentWords = [
  { word: 'Accomplish', translation: 'Hoàn thành', learned: true },
  { word: 'Brilliant', translation: 'Xuất sắc', learned: true },
  { word: 'Collaborate', translation: 'Cộng tác', learned: false },
  { word: 'Determine', translation: 'Quyết tâm', learned: true },
];

export function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredTopics = vocabularyTopics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'favorite' && topic.favorite) ||
                      (selectedTab === 'in-progress' && topic.progress > 0 && topic.progress < 100);
    return matchesSearch && matchesTab;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-success/10 text-success border-success/20';
      case 'Intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'Advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Vocabulary</h1>
        <p className="text-muted-foreground">
          Explore and master English vocabulary by topics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">1,260</p>
                <p className="text-xs text-muted-foreground">Total Words</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">487</p>
                <p className="text-xs text-muted-foreground">Learned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">38%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vocabulary topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="favorite">Favorites</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {/* Topics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTopics.map((topic) => (
              <Link key={topic.id} to={`/vocabulary/${topic.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        {topic.image}
                      </div>
                      {topic.favorite && (
                        <Star className="w-5 h-5 fill-warning text-warning" />
                      )}
                    </div>
                    <CardTitle className="line-clamp-1">{topic.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(topic.level)} variant="outline">
                        {topic.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {topic.wordCount} words
                      </span>
                    </div>
                    {topic.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{topic.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Words */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Learned</CardTitle>
          <CardDescription>Words you've studied recently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentWords.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <p className="font-medium">{item.word}</p>
                <p className="text-sm text-muted-foreground mt-1">{item.translation}</p>
                {item.learned && (
                  <Badge className="mt-2 bg-success/10 text-success border-success/20" variant="outline">
                    Learned
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
