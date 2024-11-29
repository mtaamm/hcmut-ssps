## Project structure

- `assets`: dùng để thêm hình ảnh
- `layout`: layout dùng chung cho tất cả các page (gồm header sidebar và footer, hiện chưa có tính năng login gì cả nên phân quyền trong file layout.tsx bằng một object user đơn giản, có thể thay đổi role = student hoặc spso hoặc cho user = null ứng với chưa đăng nhập để test đơn giản)
- `pages`: thư mục chính quan trong nhất, nơi viết các trang giao diện
- `types`: định nghĩa các interface hoặc type (giống như class trong c++)

## Hướng dẫn chạy

- Đảm bảo máy đã cài nodejs và dùng được 'npm'
- chạy 'npm i' để tải các thư viện
- chạy 'npm run dev' để khởi động frontend

## Hướng dẫn code

- Mỗi người vào các thư mục nhỏ trong pages code trang của mình, có thể tạo thêm các thư mục hỗ trợ tùy ý nhưng lưu ý đến ảnh hưởng quá trình merge sau này
- Dùng các thẻ UI của primereact chứ đừng dùng mấy thẻ html thuần
- Nếu ko biết làm thì dùng chatGPT, copy cái đề bài cho nó, nói cho nó mình đang dùng react với ngôn ngữ typescript, thư viện UI là primereact, dùng tailwind css thay vì css thuần, mô tả cái trang hiện tại mình muốn làm cho nó rồi cùng làm với nó

- Code rõ ràng
- Documentation of primereact: [https://primereact.org/]
- Testing sau khi code xong: `npm run lint` (nếu có `WARNING` thì bỏ qua, tập trung các problem tô đỏ)

## Tailwind (optional)

- Có thể dùng tailwind hoặc sử dụng css thuần
