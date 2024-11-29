import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosClient = axios.create({
  baseURL: "http://localhost:3000", // Địa chỉ API của bạn
  timeout: 10000, // Thời gian chờ tối đa
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Cấu hình interceptor (nếu cần)
// interceptor cho các yêu cầu
axiosClient.interceptors.request.use(
  
);

// interceptor cho các phản hồi
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Chỉ trả về dữ liệu
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
