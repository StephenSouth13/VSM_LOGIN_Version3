"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Layout } from "@/components/layout"
import { User, Mail, Calendar, Shield, Camera, Save, Key } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  role: string
  joinedAt: string
  avatar?: string
}

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

// ...existing code...
useEffect(() => {
  // Check authentication
  const userData = localStorage.getItem("vsm_user")
  if (!userData) {
    router.push("/login")
    return
  }

  const parsedUser = JSON.parse(userData)
  // Nếu là admin thì gán avatar là /long.png
  if (parsedUser.role === "admin") {
    parsedUser.avatar = "/long.png"
  }
  setUser(parsedUser)
  setFormData({
    name: parsedUser.name || "",
    avatar: parsedUser.avatar || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
}, [router])

  const handleSaveProfile = async () => {
    setIsLoading(true)

    // Mock save
    setTimeout(() => {
      if (user) {
        const updatedUser = {
          ...user,
          name: formData.name,
          avatar: formData.avatar,
        }
        setUser(updatedUser)
        localStorage.setItem("vsm_user", JSON.stringify(updatedUser))
      }
      setIsEditing(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!")
      return
    }

    if (formData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!")
      return
    }

    setIsLoading(true)

    // Mock password change
    setTimeout(() => {
      alert("Đổi mật khẩu thành công!")
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
      setIsLoading(false)
    }, 1000)
  }

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const getRoleText = (role: string) => {
    return role === "admin" ? "Quản trị viên" : "Cộng tác viên"
  }

  if (!user) {
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hồ sơ cá nhân</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý thông tin tài khoản và cài đặt bảo mật</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-[#27ae60] text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  Tham gia từ {new Date(user.joinedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Tài khoản đã xác thực</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile()
                      } else {
                        setIsEditing(true)
                      }
                    }}
                    disabled={isLoading}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Đang lưu..." : "Lưu"}
                      </>
                    ) : (
                      "Chỉnh sửa"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input id="email" value={user.email} disabled className="pl-10 bg-gray-50 dark:bg-gray-800" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL Avatar</Label>
                  <Input
                    id="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    value={formData.avatar}
                    onChange={(e) => setFormData((prev) => ({ ...prev, avatar: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Bảo mật
                </CardTitle>
                <CardDescription>Thay đổi mật khẩu để bảo vệ tài khoản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nhập mật khẩu mới"
                      value={formData.newPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Nhập lại mật khẩu mới"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={
                    !formData.currentPassword || !formData.newPassword || !formData.confirmPassword || isLoading
                  }
                  className="bg-[#27ae60] hover:bg-[#219150] text-white"
                >
                  {isLoading ? "Đang cập nhật..." : "Đổi mật khẩu"}
                </Button>
              </CardContent>
            </Card>

            {/* Account Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Thống kê hoạt động</CardTitle>
                <CardDescription>Tổng quan về hoạt động của bạn trên hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-[#27ae60]">12</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bài viết đã đăng</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-orange-500">3</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Bài nháp</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">1,234</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lượt xem</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
