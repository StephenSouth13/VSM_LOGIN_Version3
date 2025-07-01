"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Layout } from "@/components/layout"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon, X } from "lucide-react"

interface Note {
  id: string
  date: string
  title: string
  content: string
  color: string
  time?: string
}

const noteColors = [
  { name: "Xanh lá", value: "#27ae60" },
  { name: "Xanh dương", value: "#3498db" },
  { name: "Tím", value: "#9b59b6" },
  { name: "Cam", value: "#e67e22" },
  { name: "Đỏ", value: "#e74c3c" },
  { name: "Xám", value: "#95a5a6" },
]

export default function Calendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: noteColors[0].value,
    time: "",
  })

  const [adminNotifications, setAdminNotifications] = useState<Note[]>([])

  useEffect(() => {
    // Check authentication
    const userString = localStorage.getItem("vsm_user")
    if (!userString) {
      router.push("/login")
      return
    }

    const user = JSON.parse(userString)

    // Load notes from localStorage
    const savedNotes = localStorage.getItem("vsm_calendar_notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    // Load admin notifications (mock data)
    if (user.role === "admin") {
      const mockNotifications: Note[] = [
        {
          id: "admin-1",
          date: "2025-01-07",
          title: "Họp team hàng tuần",
          content: "Họp review công việc tuần",
          color: "#e74c3c",
          time: "14:00",
        },
        {
          id: "admin-2",
          date: "2025-01-10",
          title: "Deadline báo cáo tháng",
          content: "Nộp báo cáo tháng 12",
          color: "#e67e22",
          time: "17:00",
        },
      ]
      setAdminNotifications(mockNotifications)
    }
  }, [router])

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem("vsm_calendar_notes", JSON.stringify(newNotes))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getNotesForDate = (dateString: string) => {
    const userNotes = notes.filter((note) => note.date === dateString)
    const adminNotes = adminNotifications.filter((note) => note.date === dateString)
    return [...adminNotes, ...userNotes]
  }

  const handleDateClick = (day: number) => {
    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(dateString)
    setIsDialogOpen(true)
    setEditingNote(null)
    setFormData({
      title: "",
      content: "",
      color: noteColors[0].value,
      time: "",
    })
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color,
      time: note.time || "",
    })
    setIsDialogOpen(true)
  }

  const handleSaveNote = () => {
    if (!selectedDate || !formData.title.trim()) return

    const noteData = {
      id: editingNote?.id || Date.now().toString(),
      date: selectedDate,
      title: formData.title.trim(),
      content: formData.content.trim(),
      color: formData.color,
      time: formData.time,
    }

    let newNotes
    if (editingNote) {
      newNotes = notes.map((note) => (note.id === editingNote.id ? noteData : note))
    } else {
      newNotes = [...notes, noteData]
    }

    saveNotes(newNotes)
    setIsDialogOpen(false)
    setEditingNote(null)
  }

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ghi chú này?")) {
      const newNotes = notes.filter((note) => note.id !== noteId)
      saveNotes(newNotes)
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lịch công việc</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Quản lý ghi chú và lịch trình cá nhân</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
              Hôm nay
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {dayNames.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2 h-24" />
                }

                const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayNotes = getNotesForDate(dateString)
                const isToday =
                  dateString === formatDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

                return (
                  <div
                    key={day}
                    className={`p-2 h-24 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      isToday ? "bg-[#27ae60]/10 border-[#27ae60]" : ""
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${isToday ? "text-[#27ae60]" : "text-gray-900 dark:text-white"}`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayNotes.slice(0, 5).map((note, index) => (
                        <div
                          key={note.id}
                          className={`text-xs p-1 rounded truncate text-white cursor-pointer ${
                            adminNotifications.some((n) => n.id === note.id) ? "border border-yellow-300" : ""
                          }`}
                          style={{ backgroundColor: note.color }}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!adminNotifications.some((n) => n.id === note.id)) {
                              handleEditNote(note)
                            }
                          }}
                        >
                          {note.time && <span className="opacity-75">{note.time} </span>}
                          {note.title}
                          {adminNotifications.some((n) => n.id === note.id) && (
                            <span className="ml-1 text-yellow-300">📢</span>
                          )}
                        </div>
                      ))}
                      {dayNotes.length > 5 && (
                        <div
                          className="text-xs text-gray-500 text-center cursor-pointer hover:text-gray-700"
                          onClick={() => handleDateClick(day)}
                        >
                          +{dayNotes.length - 5} khác
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notes Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingNote ? "Chỉnh sửa ghi chú" : "Thêm ghi chú mới"}</DialogTitle>
              <DialogDescription>
                {selectedDate &&
                  new Date(selectedDate + "T00:00:00").toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </DialogDescription>
            </DialogHeader>

            {selectedDate && adminNotifications.filter((n) => n.date === selectedDate).length > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                  📢 Thông báo chung
                </h4>
                {adminNotifications
                  .filter((n) => n.date === selectedDate)
                  .map((notification) => (
                    <div key={notification.id} className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">
                      <span className="font-medium">{notification.time}</span> - {notification.title}
                    </div>
                  ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề ghi chú..."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Thời gian (tùy chọn)</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  placeholder="Nhập nội dung chi tiết..."
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Màu sắc</Label>
                <div className="flex gap-2">
                  {noteColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color.value ? "border-gray-900 dark:border-white" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              {editingNote && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteNote(editingNote.id)
                    setIsDialogOpen(false)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa
                </Button>
              )}
              <Button
                onClick={handleSaveNote}
                disabled={!formData.title.trim()}
                className="bg-[#27ae60] hover:bg-[#219150] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {editingNote ? "Cập nhật" : "Thêm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
