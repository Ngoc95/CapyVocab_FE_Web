import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { ArrowLeft, Search, Volume2, Star, Play } from 'lucide-react';
import { topicService } from '../../../services/topicService';

export function TopicDetailPage() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [topic, setTopic] = useState<any | null>(null);
  const [words, setWords] = useState<any[]>([]);
  useEffect(() => {
    const topicId = Number(id);
    if (!topicId) return;
    topicService.getTopicById(topicId)
      .then((res) => setTopic(res.metaData))
      .catch(() => setTopic(null));
    topicService.getTopicWords(topicId, { limit: 200 })
      .then((res) => setWords(res.metaData.words || []))
      .catch(() => setWords([]));
  }, [id]);
  const mockTopic = topic ? { 
    ...topic, 
    thumbnail: topic.thumbnail || '📚'
  } : { id, title: 'Chủ đề', thumbnail: '📚', course: '', wordCount: 0, masteredCount: 0 };
  const filteredWords = words.filter((w) =>
    (w.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.meaning || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const progress = words.length > 0 ? 0 : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      {/* Back Button */}
      <Link to="/courses">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại khóa học
        </Button>
      </Link>

      {/* Topic Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {typeof mockTopic.thumbnail === 'string' && /^(https?:\/\/|data:image)/.test(mockTopic.thumbnail) ? (
              <img
                src={mockTopic.thumbnail}
                alt={mockTopic.title || mockTopic.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <span className="text-5xl">📚</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{mockTopic.title || mockTopic.name}</h1>
            <p className="text-muted-foreground mt-1">{mockTopic.course || ''}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-muted-foreground">
                {filteredWords.length} từ trong chủ đề
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <Link to={`/flashcards/${id}`} className="flex-1 sm:flex-initial">
            <Button className="w-full sm:w-auto">
              <Play className="w-4 h-4 mr-2" />
              Học Flashcards
            </Button>
          </Link>
          <Link to={`/quiz/${id}`} className="flex-1 sm:flex-initial">
            <Button variant="outline" className="w-full sm:w-auto">
              Làm Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm từ vựng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Word Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Danh sách từ vựng ({filteredWords.length})
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{mockTopic.masteredCount} đã thuộc</Badge>
          <Badge variant="outline">{mockTopic.wordCount - mockTopic.masteredCount} đang học</Badge>
        </div>
      </div>

      {/* Words List */}
      <div className="space-y-3">
        {filteredWords.map((word) => (
          <Card key={word.id} className={`hover:shadow-md transition-shadow`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {/* Word Image */}
                {word.image && word.image !== 'N/A' && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={word.image}
                      alt={word.content}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                {/* Word & Phonetic */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold">{word.content}</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Volume2 className="w-4 h-4 text-primary" />
                        </Button>
                        {false && (
                          <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                            <Star className="w-3 h-3 mr-1 fill-success" />
                            Đã thuộc
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-primary font-mono">{word.pronunciation}</span>
                        <Badge variant="outline" className="text-xs">
                          {word.position}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Translation */}
                  <div className="pt-3 border-t">
                    <p className="text-lg">{word.meaning}</p>
                  </div>

                  {/* Example */}
                  <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                    <p className="italic">"{word.example}"</p>
                    <p className="text-sm text-muted-foreground">{word.translateExample}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWords.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Không tìm thấy từ vựng nào</p>
          </CardContent>
        </Card>
      )}

      {/* Bottom CTA */}
      <div className="sticky bottom-4 md:bottom-6">
        <Card className="border-2 border-primary shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Bắt đầu học với Flashcards</p>
                <p className="text-sm text-muted-foreground">
                  Học hiệu quả với phương pháp lặp lại ngắt quãng
                </p>
              </div>
              <Link to={`/flashcards/${id}`}>
                <Button size="lg">
                  <Play className="w-4 h-4 mr-2" />
                  Bắt đầu
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
