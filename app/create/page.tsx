"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { RichEditor } from "@/components/rich-editor"
import { Save, Eye, X } from "lucide-react"

export default function CreateArticle() {
  const router = useRouter()
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

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("vsm_user")
    if (!user) {
      router.push("/login")
      return
    }
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

    // Mock save
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("vsm_user") || "{}")
      const article = {
        id: Date.now().toString(),
        ...formData,
        tags: tagList,
        author: user.name || "Unknown",
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingArticles = JSON.parse(localStorage.getItem("vsm_articles") || "[]")
      existingArticles.push(article)
      localStorage.setItem("vsm_articles", JSON.stringify(existingArticles))

      setIsLoading(false)
      router.push("/")
    }, 1000)
  }

  const categories = ["Sự kiện", "Hướng dẫn", "Sức khỏe", "Tin tức", "Thông báo"]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tạo bài viết mới</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tạo và xuất bản bài viết cho cộng đồng VSM</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/")}>
            <X className="w-4 h-4 mr-2" />
            Hủy
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>Nhập thông tin cơ bản về bài viết</CardDescription>
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
                  placeholder="https://example.com/image.jpg"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange("thumbnail", e.target.value)}
                />
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="w-32 h-20 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=80&width=128"
                      }}
                    />
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
              <CardDescription>Soạn thảo nội dung chi tiết cho bài viết</CardDescription>
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
                <Label htmlFor="isPublished">{formData.isPublished ? "Xuất bản ngay" : "Lưu dưới dạng nháp"}</Label>
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
              {isLoading ? "Đang lưu..." : formData.isPublished ? "Xuất bản" : "Lưu nháp"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                // Preview functionality
                console.log("Preview:", formData)
              }}
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem trước
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
