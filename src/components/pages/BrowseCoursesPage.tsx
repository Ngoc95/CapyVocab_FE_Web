import { useState } from "react";
import { Link } from "react-router";
import { mockCourses } from "../../utils/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, BookOpen } from "lucide-react";

export function BrowseCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = mockCourses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-4">Khóa học tiếng Anh</h1>
        <p className="text-slate-600 mb-6">
          Khám phá các khóa học từ cơ bản đến nâng cao
        </p>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={course.isFree ? "secondary" : "default"}>
                  {course.isFree ? "Miễn phí" : "Trả phí"}
                </Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BookOpen className="w-4 h-4" />
                <span>{course.folders.length} folder học tập</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/course/${course.id}`} className="w-full">
                <Button className="w-full">Xem chi tiết</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h3 className="mb-2">Không tìm thấy khóa học</h3>
          <p className="text-slate-600">Thử tìm kiếm với từ khóa khác</p>
        </div>
      )}
    </div>
  );
}
