# Sử dụng image Node.js
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt các thư viện
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Copy file schema.prisma vào thư mục dist
RUN mkdir -p dist/prisma && cp prisma/schema.prisma dist/prisma/schema.prisma

# Copy script wait-for-it.sh vào container
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Build ứng dụng NestJS
RUN npm run build

# Expose cổng 3000 (hoặc cổng bạn sử dụng)
EXPOSE 3000

# Chạy ứng dụng ở chế độ production
CMD ["./start.sh"]