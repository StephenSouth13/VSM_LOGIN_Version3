"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, FileText, Calendar, Eye } from "lucide-react"

// Mock data for statistics
const monthlyData = [
  { month: "T1", published: 12, draft: 5, total: 17 },
  { month: "T2", published: 15, draft: 8, total: 23 },
  { month: "T3", published: 18, draft: 6, total: 24 },
  { month: "T4", published: 22, draft: 9, total: 31 },
  { month: "T5", published: 25, draft: 7, total: 32 },
  { month: "T6", published: 20, draft: 10, total: 30 },
  { month: "T7", published: 28, draft: 12, total: 40 },
  { month: "T8", published: 30, draft: 8, total: 38 },
  { month: "T9", published: 26, draft: 11, total: 37 },
  { month: "T10", published: 32, draft: 9, total: 41 },
  { month: "T11", published: 35, draft: 13, total: 48 },
  { month: "T12", published: 38, draft: 15, total: 53 },
]

const categoryData = [
  { name: "Sự kiện", value: 45, color: "#27ae60" },
  { name: "Hướng dẫn", value: 32, color: "#3498db" },
  { name: "Sức khỏe", value: 28, color: "#e67e22" },
  { name: "Tin tức", value: 25, color: "#9b59b6" },
  { name: "Thông báo", value: 18, color: "#e74c3c" },
]

const authorData = [
  { name: "Nguyễn Văn A", articles: 25, published: 22, draft: 3 },
  { name: "Trần Thị B", articles: 18, published: 15, draft: 3 },
  { name: "Lê Văn C", articles: 15, published: 12, draft: 3 },
  { name: "Phạm Thị D", articles: 12, published: 10, draft: 2 },
  { name: "Hoàng Văn E", articles: 8, published: 6, draft: 2 },
]

const viewsData = [
  { month: "T1", views: 1200 },
  { month: "T2", views: 1500 },
  { month: "T3", views: 1800 },
  { month: "T4", views: 2200 },
  { month: "T5", views: 2500 },
  { month: "T6", views: 2100 },
  { month: "T7", views: 2800 },
  { month: "T8", views: 3200 },
  { month: "T9", views: 2900 },
  { month: "T10", views: 3500 },
  { month: "T11", views: 3800 },
  { month: "T12", views: 4200 },
]

export default function Statistics() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedAuthor, setSelectedAuthor] = useState("all")

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem("vsm_user")
    if (!user) {
      router.push("/login")
      return
    }
  }, [router])

  const totalArticles = monthlyData.reduce((sum, month) => sum + month.total, 0)
  const totalPublished = monthlyData.reduce((sum, month) => sum + month.published, 0)
  const totalDrafts = monthlyData.reduce((sum, month) => sum + month.draft, 0)
  const totalViews = viewsData.reduce((sum, month) => sum + month.views, 0)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Thống kê</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Báo cáo và phân tích dữ liệu bài viết</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tác giả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả tác giả</SelectItem>
                {authorData.map((author) => (
                  <SelectItem key={author.name} value={author.name}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArticles}</div>
              <p className="text-xs text-muted-foreground">+12% so với tháng trước</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#27ae60]">{totalPublished}</div>
              <p className="text-xs text-muted-foreground">
                {((totalPublished / totalArticles) * 100).toFixed(1)}% tổng số bài viết
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bài nháp</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{totalDrafts}</div>
              <p className="text-xs text-muted-foreground">
                {((totalDrafts / totalArticles) * 100).toFixed(1)}% tổng số bài viết
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% so với tháng trước</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Articles Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Bài viết theo tháng</CardTitle>
              <CardDescription>Thống kê số lượng bài viết được tạo và xuất bản theo từng tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="published" fill="#27ae60" name="Đã xuất bản" />
                  <Bar dataKey="draft" fill="#e67e22" name="Nháp" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo danh mục</CardTitle>
              <CardDescription>Tỷ lệ bài viết theo từng danh mục nội dung</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Views Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng lượt xem</CardTitle>
              <CardDescription>Biểu đồ lượt xem bài viết theo thời gian</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#27ae60" strokeWidth={2} name="Lượt xem" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Authors */}
          <Card>
            <CardHeader>
              <CardTitle>Tác giả tích cực</CardTitle>
              <CardDescription>Top 5 tác giả có nhiều bài viết nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authorData.map((author, index) => (
                  <div key={author.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#27ae60] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{author.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {author.published} đã đăng, {author.draft} nháp
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">{author.articles}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">bài viết</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
