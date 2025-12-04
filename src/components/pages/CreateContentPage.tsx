import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Plus, X, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Flashcard, Quiz } from "../../types";

export function CreateContentPage() {
  const [folderTitle, setFolderTitle] = useState("");
  const [folderDescription, setFolderDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Flashcard form
  const [fcFront, setFcFront] = useState("");
  const [fcBack, setFcBack] = useState("");
  const [fcExample, setFcExample] = useState("");

  // Quiz form
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  const handleAddFlashcard = () => {
    if (!fcFront || !fcBack) return;

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      front: fcFront,
      back: fcBack,
      example: fcExample || undefined,
    };

    setFlashcards([...flashcards, newCard]);
    setFcFront("");
    setFcBack("");
    setFcExample("");
  };

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards(flashcards.filter((fc) => fc.id !== id));
  };

  const handleAddQuiz = () => {
    if (!quizQuestion || quizOptions.some((opt) => !opt)) return;

    const newQuiz: Quiz = {
      id: `q-${Date.now()}`,
      question: quizQuestion,
      options: [...quizOptions],
      correctAnswer,
    };

    setQuizzes([...quizzes, newQuiz]);
    setQuizQuestion("");
    setQuizOptions(["", "", "", ""]);
    setCorrectAnswer(0);
  };

  const handleRemoveQuiz = (id: string) => {
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  const handleSubmit = () => {
    if (!folderTitle || flashcards.length === 0) {
      alert("Vui lòng nhập tên folder và thêm ít nhất 1 flashcard");
      return;
    }

    // In a real app, this would send data to backend
    console.log({
      title: folderTitle,
      description: folderDescription,
      price: parseFloat(price),
      flashcards,
      quizzes,
    });

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="mb-4">Tạo nội dung thành công!</h2>
            <p className="text-slate-600 mb-2">
              Folder <strong>{folderTitle}</strong> đã được tạo
            </p>
            <p className="text-sm text-slate-500 mb-8">
              {flashcards.length} flashcards • {quizzes.length} quiz
              {price !== "0" && ` • ${parseFloat(price).toLocaleString('vi-VN')}đ`}
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setFolderTitle("");
                  setFolderDescription("");
                  setPrice("0");
                  setFlashcards([]);
                  setQuizzes([]);
                }}
              >
                Tạo folder mới
              </Button>
              <Button variant="outline" onClick={() => window.location.href = "/marketplace"}>
                Đến Marketplace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Tạo nội dung học tập</h1>
        <p className="text-slate-600">
          Tạo folder flashcard và quiz của riêng bạn để học hoặc bán trên Marketplace
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Thông tin folder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tên folder *</Label>
                <Input
                  id="title"
                  placeholder="Ví dụ: IELTS Vocabulary Band 7+"
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả nội dung và mục đích của folder..."
                  value={folderDescription}
                  onChange={(e) => setFolderDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="price">Giá bán (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p className="text-sm text-slate-500 mt-1">
                  Nhập 0 để miễn phí
                </p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="flashcards">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flashcards">
                Flashcards ({flashcards.length})
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                Quizzes ({quizzes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flashcards">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Thêm Flashcard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fc-front">Mặt trước (Tiếng Anh) *</Label>
                    <Input
                      id="fc-front"
                      placeholder="Hello"
                      value={fcFront}
                      onChange={(e) => setFcFront(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fc-back">Mặt sau (Tiếng Việt) *</Label>
                    <Input
                      id="fc-back"
                      placeholder="Xin chào"
                      value={fcBack}
                      onChange={(e) => setFcBack(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fc-example">Ví dụ</Label>
                    <Input
                      id="fc-example"
                      placeholder="Hello, how are you?"
                      value={fcExample}
                      onChange={(e) => setFcExample(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddFlashcard} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Flashcard
                  </Button>
                </CardFooter>
              </Card>

              {flashcards.length > 0 && (
                <div className="space-y-3">
                  {flashcards.map((card) => (
                    <Card key={card.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="grid md:grid-cols-2 gap-4 mb-2">
                              <div>
                                <p className="text-sm text-slate-500">Mặt trước:</p>
                                <p>{card.front}</p>
                              </div>
                              <div>
                                <p className="text-sm text-slate-500">Mặt sau:</p>
                                <p>{card.back}</p>
                              </div>
                            </div>
                            {card.example && (
                              <div>
                                <p className="text-sm text-slate-500">Ví dụ:</p>
                                <p className="italic text-sm">{card.example}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFlashcard(card.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="quizzes">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Thêm Quiz</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="quiz-question">Câu hỏi *</Label>
                    <Input
                      id="quiz-question"
                      placeholder="What does 'Hello' mean?"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                    />
                  </div>
                  {quizOptions.map((option, index) => (
                    <div key={index}>
                      <Label htmlFor={`option-${index}`}>
                        Đáp án {index + 1} *
                        {index === correctAnswer && (
                          <span className="text-green-600 ml-2">(Đúng)</span>
                        )}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`option-${index}`}
                          placeholder={`Đáp án ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...quizOptions];
                            newOptions[index] = e.target.value;
                            setQuizOptions(newOptions);
                          }}
                        />
                        <Button
                          variant={correctAnswer === index ? "default" : "outline"}
                          onClick={() => setCorrectAnswer(index)}
                          size="sm"
                        >
                          ✓
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button onClick={handleAddQuiz} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Quiz
                  </Button>
                </CardFooter>
              </Card>

              {quizzes.length > 0 && (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="mb-2">{quiz.question}</p>
                            <ul className="space-y-1 text-sm">
                              {quiz.options.map((opt, idx) => (
                                <li
                                  key={idx}
                                  className={
                                    idx === quiz.correctAnswer
                                      ? "text-green-600"
                                      : "text-slate-600"
                                  }
                                >
                                  {idx + 1}. {opt}
                                  {idx === quiz.correctAnswer && " ✓"}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveQuiz(quiz.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600">Tên folder</p>
                <p>{folderTitle || "Chưa có tên"}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Số flashcards</p>
                <p>{flashcards.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Số quiz</p>
                <p>{quizzes.length}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Giá bán</p>
                <p>
                  {price === "0" || !price
                    ? "Miễn phí"
                    : `${parseFloat(price).toLocaleString('vi-VN')}đ`}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} className="w-full" size="lg">
                Tạo Folder
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
