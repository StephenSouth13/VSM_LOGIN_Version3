# 📝 VSM Content Management System (VSM CMS)

**VSM_LOGIN_Version3** là hệ thống quản lý bài viết dành riêng cho trang tin tức chính thức của Vietnam Student Marathon tại địa chỉ:  
🌐 [https://vsm.org.vn/pages/tin-tuc](https://vsm.org.vn/pages/tin-tuc)
>![image](https://github.com/user-attachments/assets/c950f720-c2a2-47d9-9fdf-6d642da1bc65)


---

## 🚀 Giới thiệu

VSM CMS cho phép quản trị viên và cộng tác viên đăng nhập để:
- Quản lý nội dung bài viết
- Tạo và chỉnh sửa tin tức
- Tổ chức nội dung hiển thị trên trang chính của tổ chức
 ## Trang chủ
>![image](https://github.com/user-attachments/assets/8655979c-47f1-475e-8033-a360e6f9f117)

## Tạo bài viết mới
>![image](https://github.com/user-attachments/assets/11f803d8-07f2-4016-bd7b-cc1d1e40140a)

## Lịch công việc
>![image](https://github.com/user-attachments/assets/211dbdb6-a6d0-453a-912b-1a0b4a0a7acb)


## Trang Thống Kê
>![image](https://github.com/user-attachments/assets/d9aa5e4a-5d64-40d6-8235-c0ea202c32d3)

## Hồ sơ cá nhân
>![image](https://github.com/user-attachments/assets/bd3fd01a-1e7e-4268-a2ec-8c3afd62e275)


---

## 🔐 Giao diện Đăng nhập CMS

> Hệ thống quản lý nội dung Vietnam Student Marathon

- ✨ **Chào mừng trở lại**
- Vui lòng đăng nhập để truy cập hệ thống quản lý bài viết

**Thông tin đăng nhập demo:**

| Vai trò           | Email                                  |
|-------------------|----------------------------------------|
| 🛠️ Admin          | `admin@vsm.org.vn`                     |
| ✍️ Cộng tác viên   | `longquachthanh1307.ctv@vsm.org.vn`   |

---

## 🧱 Tech Stack

- [Next.js 14](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ShadCN UI](https://ui.shadcn.dev/)
- [pnpm](https://pnpm.io/) - Fast package manager

---

## 🗂️ Cấu trúc thư mục

.
├── app/ # Routing & layout chính (Next.js App Router)
├── components/ # UI components dùng lại
├── hooks/ # Custom React Hooks
├── lib/ # Thư viện phụ trợ (auth, supabase...)
├── public/ # Tài nguyên tĩnh
├── styles/ # File CSS/Tailwind
├── next.config.mjs # Cấu hình Next.js
├── tailwind.config.ts # Cấu hình Tailwind
├── tsconfig.json # Cấu hình TypeScript
└── ...

yaml
Copy
Edit

---

## 📦 Cài đặt và chạy local

```bash
# Clone dự án
git clone https://github.com/StephenSouth13/VSM_LOGIN_Version3.git
cd VSM_LOGIN_Version3

# Cài đặt dependencies
pnpm install

# Chạy dev server
pnpm dev
Truy cập giao diện tại: http://localhost:3000

📄 License
Dự án thuộc sở hữu của Vietnam Student Marathon (VSM)
© 2025 VSM | Phát triển bởi Phòng Công nghệ Thông tin

