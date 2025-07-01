"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Layout } from "@/components/layout"
import { ArrowLeft, Edit, Calendar, User, Tag, Printer, Share2 } from "lucide-react"

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
  thumbnail: "/placeholder.svg?height=400&width=800",
  shortDescription:
    "Giải Marathon Hà Nội 2024 đã diễn ra thành công với sự tham gia của hơn 10,000 vận động viên từ khắp nơi trên thế giới.",
  content: `
    <h2>Giới thiệu về giải Marathon Hà Nội 2024</h2>
    <p>Giải Marathon Hà Nội 2024 là một trong những sự kiện thể thao lớn nhất trong năm, thu hút sự tham gia của hàng nghìn vận động viên chuyên nghiệp và nghiệp dư từ khắp nơi trên thế giới.</p>
    
    <h3>Các cự ly thi đấu</h3>
    <ul>
      <li><strong>Full Marathon (42.195km)</strong> - Dành cho các vận động viên có kinh nghiệm</li>
      <li><strong>Half Marathon (21.1km)</strong> - Cự ly phổ biến nhất</li>
      <li><strong>10K Fun Run</strong> - Phù hợp cho người mới bắt đầu</li>
      <li><strong>5K Family Run</strong> - Dành cho gia đình và trẻ em</li>
    </ul>
    
    <p>Sự kiện không chỉ là cuộc thi chạy mà còn là dịp để cộng đồng chạy bộ giao lưu, học hỏi và chia sẻ kinh nghiệm.</p>
    
    <h3>Thành tích nổi bật</h3>
    <p>Năm nay, giải đấu đã ghi nhận nhiều thành tích ấn tượng:</p>
    <blockquote>
      <p>"Đây là lần đầu tiên tôi tham gia Marathon Hà Nội và tôi thực sự ấn tượng với sự tổ chức chuyên nghiệp cũng như tinh thần nhiệt huyết của các vận động viên Việt Nam." - John Smith, vận động viên đến từ Australia</p>
    </blockquote>
    
    <h3>Kết quả và giải thưởng</h3>
    <p>Các vận động viên xuất sắc đã được trao giải thưởng xứng đáng, bao gồm cúp, huy chương và các phần quà giá trị từ các nhà tài trợ.</p>
  `,
  category: "Sự kiện",
  tags: ["marathon", "hanoi", "2024", "running", "sports"],
  author: "Nguyễn Văn A",
  createdAt: "2024-12-15",
  isPublished: true,
}

export default function ArticleDetail() {
  const router = useRouter()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("vsm_user")
    if (!userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))

    // Load article data (mock)
    setArticle(mockArticle)
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.shortDescription,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link đã được sao chép vào clipboard!")
    }
  }

  const canEdit = user?.role === "admin" || (article && user?.name === article.author)

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              In bài viết
            </Button>
            {canEdit && (
              <Button
                onClick={() => router.push(`/edit/${article.id}`)}
                className="bg-[#27ae60] hover:bg-[#219150] text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        {/* Article Content */}
        <Card>
          <CardContent className="p-0">
            {/* Featured Image */}
            {article.thumbnail && (
              <div className="relative">
                <img
                  src={article.thumbnail || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={article.isPublished ? "default" : "secondary"}>
                    {article.isPublished ? "Đã đăng" : "Nháp"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Article Header */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge variant="outline" className="text-[#27ae60] border-[#27ae60]">
                  {article.category}
                </Badge>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 mr-1" />
                  {article.author}
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{article.title}</h1>

              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {article.shortDescription}
              </p>

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-8">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-[#27ae60] prose-strong:text-gray-900 dark:prose-strong:text-white prose-blockquote:border-l-[#27ae60] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Article Footer */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Về tác giả</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#27ae60] rounded-full flex items-center justify-center text-white font-semibold">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{article.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Thành viên Vietnam Student Marathon</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">Cập nhật lần cuối</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(article.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
