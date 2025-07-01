"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layout } from "@/components/layout"
import { Plus, Edit, Trash2, Search, Users, Shield, Mail } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "collaborator"
  joinedAt: string
  avatar?: string
  status: "active" | "inactive"
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@vsm.org.vn",
    role: "admin",
    joinedAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "Quách Thành Long",
    email: "longquachthanh1307.ctv@vsm.org.vn",
    role: "collaborator",
    joinedAt: "2024-02-15",
    status: "active",
  },
  {
    id: "3",
    name: "Nguyễn Văn A",
    email: "nguyenvana.ctv@vsm.org.vn",
    role: "collaborator",
    joinedAt: "2024-03-10",
    status: "active",
  },
  {
    id: "4",
    name: "Trần Thị B",
    email: "tranthib.ctv@vsm.org.vn",
    role: "collaborator",
    joinedAt: "2024-03-20",
    status: "inactive",
  },
]

export default function UsersManagement() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "collaborator" as "admin" | "collaborator",
  })

  useEffect(() => {
    // Check authentication and admin role
    const userData = localStorage.getItem("vsm_user")
    if (!userData) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "admin") {
      router.push("/")
      return
    }

    setCurrentUser(user)
  }, [router])

  useEffect(() => {
    // Filter users
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      role: "collaborator",
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (!formData.name.trim() || !formData.email.trim()) return

    // Generate email if needed
    let email = formData.email
    if (!email.includes("@")) {
      const nameParts = formData.name.toLowerCase().split(" ")
      const username = nameParts.join("")
      email = `${username}.${formData.role === "admin" ? "admin" : "ctv"}@vsm.org.vn`
    }

    const userData = {
      id: editingUser?.id || Date.now().toString(),
      name: formData.name.trim(),
      email: email,
      role: formData.role,
      joinedAt: editingUser?.joinedAt || new Date().toISOString().split("T")[0],
      status: "active" as const,
    }

    let newUsers
    if (editingUser) {
      newUsers = users.map((user) => (user.id === editingUser.id ? userData : user))
    } else {
      newUsers = [...users, userData]
    }

    setUsers(newUsers)
    setIsDialogOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const newUsers = users.filter((user) => user.id !== userId)
      setUsers(newUsers)
    }
  }

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  const getRoleText = (role: string) => {
    return role === "admin" ? "Quản trị viên" : "Cộng tác viên"
  }

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const getStatusText = (status: string) => {
    return status === "active" ? "Hoạt động" : "Tạm khóa"
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Không có quyền truy cập</h2>
            <p className="text-gray-600">Chỉ quản trị viên mới có thể truy cập trang này</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quản lý thành viên</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Tổng cộng {filteredUsers.length} thành viên</p>
          </div>
          <Button onClick={handleAddUser} className="bg-[#27ae60] hover:bg-[#219150] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm thành viên
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng thành viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quản trị viên</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{users.filter((u) => u.role === "admin").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cộng tác viên</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.role === "collaborator").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="collaborator">Cộng tác viên</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thành viên</CardTitle>
            <CardDescription>Quản lý thông tin và quyền hạn của các thành viên</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thành viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback className="bg-[#27ae60] text-white text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>{getRoleText(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>{getStatusText(user.status)}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.joinedAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.id !== currentUser.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}</DialogTitle>
              <DialogDescription>
                {editingUser ? "Cập nhật thông tin thành viên" : "Thêm thành viên mới vào hệ thống"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  placeholder="Nhập họ và tên..."
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Để trống để tự động tạo email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
                {!formData.email && formData.name && (
                  <p className="text-xs text-gray-500">
                    Email sẽ được tạo tự động: {formData.name.toLowerCase().split(" ").join("")}.
                    {formData.role === "admin" ? "admin" : "ctv"}@vsm.org.vn
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "collaborator") => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaborator">Cộng tác viên</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleSaveUser}
                disabled={!formData.name.trim()}
                className="bg-[#27ae60] hover:bg-[#219150] text-white"
              >
                {editingUser ? "Cập nhật" : "Thêm thành viên"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
