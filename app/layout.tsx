import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VSM CMS - Vietnam Student Marathon Content Management System",
  description: "Hệ thống quản lý nội dung cho tổ chức Vietnam Student Marathon",
    generator: 'Thành Long - stephensouth@gmail.com'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
