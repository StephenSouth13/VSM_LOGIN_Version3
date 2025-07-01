"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Layout } from "@/components/layout"
import { RichEditor } from "@/components/rich-editor"
import { Save, Eye, X, Trash2 } from "lucide-react"

interface Article {
  id: string
  title: string
  thumbnail: string
  shortDescription: string
  content: string
  category: string
  tags: string[]
  author: string
  createdAt: string
  isPublished: boolean
}

// Mock article data
const mockArticle: Article = {
  id: "1",
  title: "Giải Marathon Hà Nội 2024 - Sự kiện thể thao lớn nhất năm",
  thumbnail: "/placeholder.svg?height=200&width=300",
  shortDescription:
    "Giải Marathon Hà Nội 2024 đã diễn ra thành công với sự tham gia của hơn 10,000 vận động viên từ khắp nơi trên thế giới.",
  content:
    "<h2>Giới thiệu về giải Marathon Hà Nội 2024</h2><p>Giải Marathon Hà Nội 2024 là một trong những sự kiện thể thao lớn nhất trong năm, thu hút sự tham gia của hàng nghìn vận động viên chuyên nghiệp và nghiệp dư từ khắp nơi trên thế giới.</p><h3>Các cự ly thi đấu</h3><ul><li>Full Marathon (42.195km)</li><li>Half Marathon (21.1km)</li><li>10K Fun Run</li><li>5K Family Run</li></ul><p>Sự kiện không chỉ là cuộc thi chạy mà còn là dịp để cộng đồng chạy bộ giao lưu, học hỏi và chia sẻ kinh nghiệm.</p>",
  category: "Sự kiện",
  tags: ["marathon", "hanoi", "2024", "running"],
  author: "Nguyễn Văn A",
  createdAt: "2024-12-15",
  isPublished: true,
}

export default function EditArticle() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    shortDescription: "",
    content: "",
    category: "",
    tags: "",
    isPublished: false,
  })
  const [tagList, setTagList] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("vsm_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load article data (mock)
    setArticle(mockArticle)
    setFormData({
      title: mockArticle.title,
      thumbnail: mockArticle.thumbnail,
      shortDescription: mockArticle.shortDescription,
      content: mockArticle.content,
      category: mockArticle.category,
      tags: "",
      isPublished: mockArticle.isPublished,
    })
    setTagList(mockArticle.tags)
  }, [router])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.tags.trim()) {
      e.preventDefault()
      const newTag = formData.tags.trim().toLowerCase()
      if (!tagList.includes(newTag)) {
        setTagList((prev) => [...prev, newTag])
      }
      setFormData((prev) => ({ ...prev, tags: "" }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTagList((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock update
    setTimeout(() => {
      console.log("Article updated:", { ...formData, tags: tagList })
      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      setIsLoading(true)
      // Mock delete
      setTimeout(() => {
        setIsLoading(false)
        router.push("/")
      }, 1000)
    }
  }

  const canDelete = user?.role === "admin" || (article && user?.name === article.author)
  const categories = ["Sự kiện", "Hướng dẫn", "Sức khỏe", "Tin tức", "Thông báo"]

  if (!article) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Đang tải...</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chỉnh sửa bài viết</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Cập nhật thông tin bài viết "{article.title}"</p>
          </div>
          <div className="flex gap-2">
            {canDelete && (
              <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/")}>
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
          </div>
        </div>

        {user?.role !== "admin" && user?.name !== article.author && (
          <Alert>
            <AlertDescription>Bạn chỉ có thể chỉnh sửa bài viết của chính mình.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Cập nhật thông tin cơ bản về bài viết</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài viết *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL ảnh thumbnail</Label>
                <Input
                  id="thumbnail"
                  placeholder="/long.png"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                />
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail || "/long.png"}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=80&width=128"
                      }}
                    />
                  </div>
                )}
                {/* Gợi ý cho admin */}
                {user?.role === "admin" && (
                  <div className="text-xs text-gray-500 mt-1">
                    Gợi ý: Để dùng ảnh mặc định admin, nhập{" "}
                    <span className="font-mono bg-gray-100 px-1 rounded">/long.png</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Mô tả ngắn *</Label>
                <Textarea
                  id="shortDescription"
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Nhập tag và nhấn Enter"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  {tagList.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagList.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                          #{tag} <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
              <CardDescription>Chỉnh sửa nội dung chi tiết cho bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <RichEditor content={formData.content} onChange={(content) => handleInputChange("content", content)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt xuất bản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                />
                <Label htmlFor="isPublished">{formData.isPublished ? "Đã xuất bản" : "Lưu dưới dạng nháp"}</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-[#27ae60] hover:bg-[#219150] text-white"
              disabled={isLoading || !formData.title || !formData.shortDescription || !formData.category}
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Đang cập nhật..." : "Cập nhật bài viết"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(`/detail/${article.id}`)}>
              <Eye className="w-4 h-4 mr-2" />
              Xem bài viết
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
