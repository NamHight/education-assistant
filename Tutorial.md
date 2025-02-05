# 📌 Quy Định GitHub & Hướng Dẫn Cấu Trúc Folder cho .NET API

## 🚀 Quy Tắc Làm Việc Với GitHub

### 1️⃣ **Quy Tắc Đặt Tên Nhánh**
- **Tên nhánh**: `[Tên bản thân]` (Ví dụ: `namdoan`)

### 2️⃣ **Quy Trình Pull Request (PR) và code**
1. git clone dự án.
2. check out tới nhánh của mình (ví dụ git checkout namdoan) không -b tạo nhánh mới.
3. code trên nhánh của mình.
4. khi nghe thông báo của lượt pull request mới từ nhánh của mình cứ làm xong chức năng rồi commit lại.
5. sau khi commit và push lên nhanh của mình.
6. chuyển về nhanh main rồi git pull về.
7. sau khi git pull rồi chuyển về nhành của mình rồi git merge origin `develop`.
8. sau đó kiểm tra status rồi conflict rồi push lên nhanh mình.
9. sau đó rồi kiểm tra lại 1 lần nữa rồi lên website github.com để pull request ( nhớ để ý từ nhành mình pull request vào nhánh `develop`)
5. Sau khi review xong, merge vào `develop`.
6. Khi đã ổn định, merge `develop` vào `main`.

---

### 3️⃣ **Quy Tắc Commit Message (ghi bằng tiếng việt) **
- `update: tên chức năng của mình `
- `fix: Sửa lỗi tên chức năng`
- `complete: hoàn hiện tên chức năng của mình`
  
---

## 🚀 Quy Tắc Làm Việc Với Nhóm
1. Code phải đồng bộ từ trên xuống dưới để dễ đọc code và hiểu.
2. Không biết cái gì phải thống báo nói với nhóm để cùng nhau giải quyết.
3. không im lặng khi làm việc nhóm.

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
- **ASP.NET Core 8+**
- **Entity Framework Core** (EF Core)
- **MongoDB / Firebase** (tùy dự án)
- **Swagger** (Tài liệu API)
- **Serilog** (Logging)
- **xUnit / NUnit** (Test)
  
---

## 📌 Lưu Ý
- **Không commit trực tiếp vào `main` hoặc `develop`**.
- **Code phải được review trước khi merge**.
- **Chạy test trước khi push code**.

🚀 Chúc bạn coding vui vẻ! 😎

