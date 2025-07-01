"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Eye, Edit } from "lucide-react"
import { Layout } from "@/components/layout"

interface Article {
  id: string
  title: string
  shortDescription: string
  thumbnail: string
  category: string
  tags: string[]
  author: string
  createdAt: string
  isPublished: boolean
}

// Mock data for demonstration
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Giải Marathon Hà Nội 2024 - Sự kiện thể thao lớn nhất năm",
    shortDescription:
      "Giải Marathon Hà Nội 2024 đã diễn ra thành công với sự tham gia của hơn 10,000 vận động viên từ khắp nơi trên thế giới.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Sự kiện",
    tags: ["marathon", "hanoi", "2024"],
    author: "Nguyễn Văn A",
    createdAt: "2024-12-15",
    isPublished: true,
  },
  {
    id: "2",
    title: "Hướng dẫn tập luyện Marathon cho người mới bắt đầu",
    shortDescription: "Những lời khuyên và kế hoạch tập luyện chi tiết dành cho những người mới bắt đầu chạy Marathon.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Hướng dẫn",
    tags: ["training", "beginner", "tips"],
    author: "Trần Thị B",
    createdAt: "2024-12-10",
    isPublished: true,
  },
  {
    id: "3",
    title: "Dinh dưỡng cho vận động viên Marathon",
    shortDescription:
      "Chế độ dinh dưỡng khoa học giúp vận động viên Marathon đạt hiệu suất tối ưu trong quá trình tập luyện và thi đấu.",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Sức khỏe",
    tags: ["nutrition", "health", "performance"],
    author: "Lê Văn C",
    createdAt: "2024-12-05",
    isPublished: false,
  },
]

export default function Dashboard() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(mockArticles)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("vsm_user")
    if (!user) {
      router.push("/login")
      return
    }

    // Filter and sort articles
    const filtered = articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort articles
    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory, sortBy, router])

  const categories = ["all", ...Array.from(new Set(articles.map((a) => a.category)))]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý bài viết</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tổng cộng {filteredArticles.length} bài viết</p>
          </div>
          <Button onClick={() => router.push("/create")} className="bg-[#27ae60] hover:bg-[#219150] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Tất cả danh mục" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mới nhất</SelectItem>
              <SelectItem value="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={article.isPublished ? "default" : "secondary"}>
                    {article.isPublished ? "Đã đăng" : "Nháp"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{article.category}</Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                <CardDescription className="line-clamp-3">{article.shortDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Bởi {article.author}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/detail/${article.id}`)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push(`/edit/${article.id}`)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-600 dark:text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
