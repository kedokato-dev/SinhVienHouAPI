# 🎓 SinhVienHouAPI

Backend API cho ứng dụng **MyHOU** - Trợ lý học tập dành cho sinh viên Đại học Mở Hà Nội.

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

## 📝 Giới thiệu

SinhVienHouAPI là hệ thống backend RESTful API được phát triển để hỗ trợ sinh viên trường Đại học Mở Hà Nội truy cập các thông tin học tập như lịch học, điểm số, lịch thi và các thông tin cá nhân một cách thuận tiện. API này kết nối trực tiếp với hệ thống quản lý đào tạo của trường thông qua cơ chế xác thực CAS.

## ✨ Tính năng chính

- **🔐 Xác thực người dùng**: Đăng nhập an toàn thông qua hệ thống CAS của trường
- **👤 Thông tin sinh viên**: Truy xuất thông tin cá nhân và học tập
- **📊 Quản lý điểm số**: Xem điểm tổng hợp và chi tiết các môn học
- **📅 Lịch học và lịch thi**: Tra cứu lịch học theo tuần và lịch thi
- **🌟 Điểm rèn luyện**: Xem điểm rèn luyện theo học kỳ
- **💬 Phản hồi**: Hệ thống gửi và quản lý feedback từ người dùng

## 🛠️ Công nghệ sử dụng

<p align="center">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
    <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
    <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
    <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios">
    <img src="https://img.shields.io/badge/Cheerio-2ECC71?style=for-the-badge&logo=cheerio&logoColor=white" alt="Cheerio">
</p>

- **Node.js & Express**: Nền tảng phát triển RESTful API
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **Axios**: Thư viện HTTP client để gửi yêu cầu đến hệ thống của trường
- **Cheerio**: Phân tích dữ liệu HTML trả về từ hệ thống trường
- **Body-parser**: Xử lý dữ liệu trong yêu cầu HTTP

## ⚙️ Cài đặt

### Yêu cầu hệ thống

- Node.js (v14.x hoặc cao hơn)
- npm/yarn
- MongoDB

### Các bước cài đặt

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-username/SinhVienHouAPI.git
   cd SinhVienHouAPI
   ```

2. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

3. **Tạo file môi trường**:
   ```bash
   # Tạo file .env với nội dung
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Khởi động server**:
   ```bash
   npm start
   ```

## 🚀 Triển khai

API được triển khai trên nền tảng Render.com.

🔗 **Live URL**: [https://sinhvienhouapi.onrender.com/](https://sinhvienhouapi.onrender.com/)

## 👥 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để góp phần phát triển dự án.

<p align="center">
  <a href="https://github.com/kedokato-dev/SinhVienHouAPI/issues">Báo cáo lỗi</a>
  ·
  <a href="https://github.com/kedokato-dev/SinhVienHouAPI/pulls">Yêu cầu tính năng</a>
</p>

## 📞 Liên hệ

<p align="center">
  <img src="https://img.shields.io/badge/Developer-Trần_Anh_Quân-orange" alt="Developer">
</p>

- **👨‍💻 Developer**: Trần Anh Quân
- **📧 Email**: thocodeanhquan@gmail.com
- **🌐 GitHub**: [kedokato-dev](https://github.com/kedokato-dev)

## 📄 Giấy phép

[MIT License](LICENSE)

---

<p align="center">Made with ❤️ for HOU students</p>