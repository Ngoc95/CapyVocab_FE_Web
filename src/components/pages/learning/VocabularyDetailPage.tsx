import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { 
  ArrowLeft, 
  Play, 
  Star, 
  Volume2, 
  Search,
  BookmarkPlus,
  CheckCircle2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

const mockVocabularyData = {
  'topic-1': {
    title: 'Daily Conversation',
    description: 'Common phrases for everyday situations',
    level: 'Beginner',
    words: [
      { 
        id: 1, 
        word: 'Hello', 
        phonetic: '/həˈloʊ/', 
        translation: 'Xin chào', 
        partOfSpeech: 'interjection',
        example: 'Hello! How are you today?',
        exampleTranslation: 'Xin chào! Hôm nay bạn thế nào?',
        learned: true
      },
      { 
        id: 2, 
        word: 'Thank you', 
        phonetic: '/θæŋk juː/', 
        translation: 'Cảm ơn', 
        partOfSpeech: 'phrase',
        example: 'Thank you for your help!',
        exampleTranslation: 'Cảm ơn bạn đã giúp đỡ!',
        learned: true
      },
      { 
        id: 3, 
        word: 'Please', 
        phonetic: '/pliːz/', 
        translation: 'Làm ơn', 
        partOfSpeech: 'adverb',
        example: 'Please pass me the salt.',
        exampleTranslation: 'Làm ơn đưa tôi lọ muối.',
        learned: false
      },
      { 
        id: 4, 
        word: 'Excuse me', 
        phonetic: '/ɪkˈskjuːz miː/', 
        translation: 'Xin lỗi', 
        partOfSpeech: 'phrase',
        example: 'Excuse me, where is the restroom?',
        exampleTranslation: 'Xin lỗi, nhà vệ sinh ở đâu?',
        learned: false
      },
      { 
        id: 5, 
        word: 'Goodbye', 
        phonetic: '/ɡʊdˈbaɪ/', 
        translation: 'Tạm biệt', 
        partOfSpeech: 'interjection',
        example: 'Goodbye! See you tomorrow.',
        exampleTranslation: 'Tạm biệt! Hẹn gặp lại vào ngày mai.',
        learned: true
      },
    ]
  }
};

export function VocabularyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  const topicData = mockVocabularyData['topic-1'];
  
  const filteredWords = topicData.words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         word.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'learned' && word.learned) ||
                      (selectedTab === 'learning' && !word.learned);
    return matchesSearch && matchesTab;
  });

  const progress = Math.round((topicData.words.filter(w => w.learned).length / topicData.words.length) * 100);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl space-y-6">
      {/* Back Button */}
      <Link to="/vocabulary">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Vocabulary
        </Button>
      </Link>

      {/* Topic Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-4xl">
                🗣️
              </div>
              <div>
                <h1 className="text-3xl font-bold">{topicData.title}</h1>
                <p className="text-muted-foreground">{topicData.description}</p>
              </div>
            </div>
          </div>
          <Badge className="bg-success/10 text-success border-success/20" variant="outline">
            {topicData.level}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {topicData.words.filter(w => w.learned).length} of {topicData.words.length} words learned
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link to={`/flashcards/${id}`} className="flex-1 md:flex-initial">
            <Button className="w-full">
              <Play className="w-4 h-4 mr-2" />
              Start Flashcards
            </Button>
          </Link>
          <Link to={`/quiz/${id}`} className="flex-1 md:flex-initial">
            <Button variant="outline" className="w-full">
              Take Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search words..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Words ({topicData.words.length})</TabsTrigger>
          <TabsTrigger value="learned">Learned ({topicData.words.filter(w => w.learned).length})</TabsTrigger>
          <TabsTrigger value="learning">Learning ({topicData.words.filter(w => !w.learned).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {/* Words List */}
          <div className="space-y-3">
            {filteredWords.map((word) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {/* Word Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">{word.word}</h3>
                            <button className="text-muted-foreground hover:text-primary transition-colors">
                              <Volume2 className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {word.phonetic} • {word.partOfSpeech}
                          </p>
                        </div>
                        {word.learned && (
                          <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-base">
                          <span className="font-medium">Translation:</span>{' '}
                          <span className="text-muted-foreground">{word.translation}</span>
                        </p>
                        
                        <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                          <p className="text-sm italic">{word.example}</p>
                          <p className="text-sm text-muted-foreground">{word.exampleTranslation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button size="icon" variant="ghost">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
