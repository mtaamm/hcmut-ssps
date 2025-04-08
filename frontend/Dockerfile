# Sử dụng image Node.js để build ứng dụng
FROM node:18 AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ file tĩnh
FROM nginx:alpine

# Copy file build từ bước trước vào thư mục Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose cổng 80
EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]