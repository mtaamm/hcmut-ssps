# Hướng dẫn chạy code

## Chuẩn bị

- Cài nodejs nếu chưa cài, đảm bảo sử dụng được npm
- Cài mysql, setup các kiểu nếu chưa cài, tạo database trống tên là printing_service
- Vào file .env trong backend sửa DATABASE_URL cho phù hợp với database local của mình

## Chạy

### Mở 1 tab terminal, vào thư mục backend

- chạy `npm i` để tải các thư viện
- chạy `npx prisma migrate dev --name init` để kết nối và đồng bộ database
- chạy `npm run seed` để tạo dữ liệu seed cho database
- vào thư mục backend chạy `npm run start:dev` để khởi động server

### Mở thêm 1 tab terminal, vào thư mục backend, chạy `npx prisma studio`, bấm link được tạo ra để xem database, sửa username và password cho dễ đăng nhập

### Mở thêm 1 tab terminal, vào thư mục frontend

- chạy `npn i` để tải thư viện
- chạy `npm run dev`, bấm link được tạo ra để vào web
