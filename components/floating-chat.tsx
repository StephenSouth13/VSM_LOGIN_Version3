"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, X, Send, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userData = localStorage.getItem("vsm_user")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }

    // Load mock messages
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: "Admin",
        content: "Chào mọi người! Hôm nay chúng ta có cuộc họp lúc 2 giờ chiều.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isCurrentUser: false,
      },
      {
        id: "2",
        sender: "Nguyễn Văn A",
        content: "Dạ em đã chuẩn bị xong báo cáo rồi ạ!",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        isCurrentUser: false,
      },
    ]
    setMessages(mockMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser) return

    const message: Message = {
      id: Date.now().toString(),
      sender: currentUser.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isCurrentUser: true,
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!currentUser) return null

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#27ae60] hover:bg-[#219150] text-white shadow-lg z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-[#27ae60] text-white rounded-t-lg">
            <CardTitle className="text-sm font-medium">Chat nhóm VSM</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-6 h-6 p-0 text-white hover:bg-[#219150]"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 p-0 text-white hover:bg-[#219150]"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="flex-1 p-3 overflow-y-auto">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[80%] ${message.isCurrentUser ? "flex-row-reverse" : ""}`}>
                        <Avatar className="w-6 h-6 flex-shrink-0">
                          <AvatarFallback className="bg-[#27ae60] text-white text-xs">
                            {message.sender.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`p-2 rounded-lg text-sm ${
                              message.isCurrentUser
                                ? "bg-[#27ae60] text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                          >
                            {message.content}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 px-1">
                            {message.sender} • {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-[#27ae60] hover:bg-[#219150] text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  )
}
