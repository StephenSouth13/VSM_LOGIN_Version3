"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate VSM email
    if (!email.endsWith("@vsm.org.vn")) {
      setError("Chỉ chấp nhận email kết thúc bằng @vsm.org.vn")
      setIsLoading(false)
      return
    }

    // Mock authentication
    setTimeout(() => {
      if (email && password) {
        // Determine role based on email
        const role = email.includes(".admin@") ? "admin" : "collaborator"
        const name = email
          .split("@")[0]
          .replace(/\./g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())

        const user = {
          email,
          name,
          role,
          joinedAt: new Date().toISOString(),
        }

        localStorage.setItem("vsm_user", JSON.stringify(user))
        router.push("/")
      } else {
        setError("Vui lòng nhập đầy đủ thông tin")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <img src="/logo.png" alt="VSM Logo" className="mx-auto h-20 w-auto" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">Đăng nhập CMS</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Hệ thống quản lý nội dung Vietnam Student Marathon
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Chào mừng trở lại</CardTitle>
              <CardDescription>Đăng nhập để truy cập hệ thống quản lý bài viết</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="ten.cua.ban@vsm.org.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#27ae60] hover:bg-[#219150] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Demo accounts:</p>
                <p className="text-xs text-gray-500 mt-1">
                  Admin: admin@vsm.org.vn | Cộng tác viên: longquachthanh1307.ctv@vsm.org.vn
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Homepage preview */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center p-8 bg-gradient-to-br from-[#27ae60] to-[#219150]">
        <div className="text-center text-white space-y-6 max-w-lg">
          <div className="relative">
            <img
              src="/hero.png"
              alt="VSM Homepage Preview"
              className="rounded-lg shadow-2xl mx-auto w-full h-full object-cover max-w-md"
              style={{ minHeight: "350px", maxHeight: "500px" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-3">Vietnam Student Marathon</h3>
            <p className="text-lg lg:text-xl opacity-90 leading-relaxed">
              Nền tảng kết nối cộng đồng chạy bộ sinh viên Việt Nam
            </p>
            <p className="text-sm opacity-75 mt-2">Hệ thống quản lý nội dung chuyên nghiệp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
