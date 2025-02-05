# 📌 Quy Định GitHub & Hướng Dẫn Cấu Trúc Folder cho .NET API

## 🚀 Quy Tắc Làm Việc Với GitHub

### 1️⃣ **Quy Tắc Đặt Tên Nhánh**
- **Tính năng mới**: `feature/[ten-tinh-nang]` (Ví dụ: `feature/add-user-auth`)
- **Sửa lỗi**: `bugfix/[ten-bug]` (Ví dụ: `bugfix/fix-login-error`)
- **Cải thiện code**: `refactor/[ten-module]` (Ví dụ: `refactor/refactor-user-service`)
- **Cập nhật tài liệu**: `docs/[ten-cap-nhat]` (Ví dụ: `docs/update-readme`)

### 2️⃣ **Quy Trình Pull Request (PR)**
1. Tạo nhánh mới từ `develop`.
2. Code & commit theo đúng chuẩn.
3. Mở Pull Request (PR) về `develop`.
4. Gửi review code từ đồng đội.
5. Sau khi review xong, merge vào `develop`.
6. Khi đã ổn định, merge `develop` vào `main`.

### 3️⃣ **Quy Tắc Commit Message**
- `feat: Thêm API đăng ký tài khoản`
- `fix: Sửa lỗi validate email`
- `refactor: Cải thiện hiệu năng service`
- `chore: Cập nhật package dependency`
- `test: Thêm unit test cho login service`

---

## 📁 Cấu Trúc Folder Trong .NET API

```
📂 MyProject.Api
│── 📂 Controllers          # Chứa các API controllers
│── 📂 Services             # Xử lý logic nghiệp vụ
│── 📂 Repositories         # Xử lý truy vấn database
│── 📂 Data                 # Chứa DbContext và cấu hình database
│── 📂 DTOs                 # Định nghĩa Data Transfer Objects
│── 📂 Models               # Định nghĩa các entity/model
│── 📂 Filters              # Middleware xử lý exception, validation
│── 📂 Extensions           # Chứa các phương thức mở rộng (helper, extension method)
│── 📂 Configurations       # Chứa file cấu hình (AppSettings, dependency injection)
│── 📂 Middlewares          # Xử lý request pipeline (Logging, Auth...)
│── 📂 Migrations           # Chứa các file migration của Entity Framework
│── 📂 Tests                # Chứa các Unit Test và Integration Test
│── appsettings.json        # File cấu hình ứng dụng
│── Program.cs              # Điểm khởi động ứng dụng
│── Startup.cs              # Cấu hình ứng dụng, middleware, DI
```

---

## 🔥 Mô Tả Các Thư Mục Chính

### **📂 Controllers**
- Chứa các API controllers xử lý HTTP request.
- Mỗi controller tương ứng với một resource cụ thể (UserController, ProductController, ...).

### **📂 Services**
- Chứa các lớp xử lý logic nghiệp vụ.
- Dùng **Dependency Injection (DI)** để gọi các repository cần thiết.

### **📂 Repositories**
- Chứa các lớp truy vấn database, thường sử dụng **Entity Framework (EF)**.
- Mỗi entity sẽ có một repository riêng.

### **📂 Data**
- Chứa `ApplicationDbContext.cs` (EF DbContext) và các cấu hình database.

### **📂 DTOs (Data Transfer Objects)**
- Chứa các object dùng để truyền dữ liệu giữa client và server.
- DTO giúp tách biệt dữ liệu đầu vào/ra khỏi model chính.

### **📂 Models**
- Chứa các entity chính, thường là các bảng trong database.

### **📂 Filters**
- Chứa các middleware dùng để validate dữ liệu request hoặc xử lý exception chung.

### **📂 Extensions**
- Chứa các phương thức mở rộng (Helper method, Extension method).

### **📂 Configurations**
- Chứa các lớp cấu hình như `AppSettings.cs`, `DependencyInjection.cs`.

### **📂 Middlewares**
- Chứa các middleware tự định nghĩa, như Logging, Authentication, Exception Handling.

### **📂 Migrations**
- Chứa các file migration của **Entity Framework**.

### **📂 Tests**
- Chứa Unit Test và Integration Test.
- Dùng **xUnit, NUnit hoặc MSTest**.

---

## 🛠 Công Nghệ Sử Dụng
- **ASP.NET Core 7+**
- **Entity Framework Core** (EF Core)
- **SQL Server / PostgreSQL / MongoDB** (tùy dự án)
- **Swagger** (Tài liệu API)
- **Serilog** (Logging)
- **xUnit / NUnit** (Test)
---

## 📌 Lưu Ý
- **Không commit trực tiếp vào `main` hoặc `develop`**.
- **Code phải được review trước khi merge**.
- **Chạy test trước khi push code**.

🚀 Chúc bạn coding vui vẻ! 😎

