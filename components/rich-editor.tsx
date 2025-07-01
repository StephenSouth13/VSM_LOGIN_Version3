"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  ImageIcon,
  Video,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"

interface RichEditorProps {
  content: string
  onChange: (content: string) => void
}

export function RichEditor({ content, onChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertImage = () => {
    const url = prompt("Nhập URL hình ảnh:")
    if (url) {
      executeCommand("insertImage", url)
    }
  }

  const insertLink = () => {
    const url = prompt("Nhập URL liên kết:")
    if (url) {
      executeCommand("createLink", url)
    }
  }

  const insertVideo = () => {
    const url = prompt("Nhập URL video (YouTube, Vimeo):")
    if (url) {
      let embedUrl = url

      // Convert YouTube URL to embed format
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1].split("?")[0]
        embedUrl = `https://www.youtube.com/embed/${videoId}`
      }

      const iframe = `<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
      executeCommand("insertHTML", iframe)
    }
  }

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "In đậm" },
    { icon: Italic, command: "italic", title: "In nghiêng" },
    { icon: Underline, command: "underline", title: "Gạch chân" },
    { icon: List, command: "insertUnorderedList", title: "Danh sách không thứ tự" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Danh sách có thứ tự" },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Trích dẫn" },
    { icon: AlignLeft, command: "justifyLeft", title: "Căn trái" },
    { icon: AlignCenter, command: "justifyCenter", title: "Căn giữa" },
    { icon: AlignRight, command: "justifyRight", title: "Căn phải" },
  ]

  const headingButtons = [
    { label: "H1", command: "formatBlock", value: "h1" },
    { label: "H2", command: "formatBlock", value: "h2" },
    { label: "H3", command: "formatBlock", value: "h3" },
    { label: "P", command: "formatBlock", value: "p" },
  ]

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Heading buttons */}
          <div className="flex gap-1 mr-2">
            {headingButtons.map((btn) => (
              <Button
                key={btn.label}
                variant="ghost"
                size="sm"
                onClick={() => executeCommand(btn.command, btn.value)}
                className="h-8 px-2 text-xs"
              >
                {btn.label}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Format buttons */}
          {toolbarButtons.map((btn, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(btn.command, btn.value)}
              title={btn.title}
              className="h-8 w-8 p-0"
            >
              <btn.icon className="w-4 h-4" />
            </Button>
          ))}

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Media buttons */}
          <Button variant="ghost" size="sm" onClick={insertLink} title="Chèn liên kết" className="h-8 w-8 p-0">
            <Link className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={insertImage} title="Chèn hình ảnh" className="h-8 w-8 p-0">
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={insertVideo} title="Chèn video" className="h-8 w-8 p-0">
            <Video className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: content }}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      />

      {/* Helper text */}
      <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Sử dụng các nút trên thanh công cụ để định dạng văn bản. Hỗ trợ chèn hình ảnh, video và liên kết.
        </p>
      </div>
    </div>
  )
}
