import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Student } from "../../../axios/user";
import { format } from "date-fns";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // State để lưu thông tin user
  const [user, setUser] = useState<Student | null>(null);

  useEffect(() => {
    // Lấy dữ liệu sinh viên từ localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Nếu chưa có thông tin user, render loading hoặc thông báo
  if (!user) {
    return <div>Loading...</div>;
  }

  // Tính tổng số trang còn lại
  const totalRemainingPages = user.page_size.reduce(
    (total, size) => total + size.current_page,
    0
  );

  // Lấy 3 lệnh in gần nhất
  const recentPrintJobs = user.recent_print_jobs.slice(0, 3);

  // Xử lý icon theo loại file
  const getFileIcon = (filetype: string) => {
    switch (filetype) {
      case "doc":
      case "docx":
        return "pi pi-file-word";
      case "pdf":
        return "pi pi-file-pdf";
      case "xlsx":
      case "xls":
        return "pi pi-file-excel";
      default:
        return "pi pi-file";
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trang chủ</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/buy-pages")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Thêm giấy in
          </button>
          <button
            onClick={() => navigate("/create-print-job")}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Tạo lệnh in
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Card 1: Số lệnh in */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-medium">Số lệnh in</h2>
          <p className="text-3xl font-bold text-blue-500 mt-2">
            {user.print_job_count}
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Lệnh in đang chờ</span>
              <span>{user.progress_print_job}</span>
            </div>
            <div className="flex justify-between">
              <span>Lệnh in thành công</span>
              <span>{user.success_print_job}</span>
            </div>
            <div className="flex justify-between">
              <span>Lệnh in thất bại</span>
              <span>{user.fail_print_job}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Số trang còn lại */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-medium">Số trang còn lại</h2>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {totalRemainingPages} trang
          </p>
          <div className="mt-4 space-y-2">
            {user.page_size.map((size, index) => (
              <div key={index} className="flex justify-between">
                <span>{size.page_size}</span>
                <span>{size.current_page} trang</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lịch sử in */}
      <div className="bg-white p-6 shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">Lịch sử in</h2>
          <button
            onClick={() => navigate("/print-history")}
            className="text-blue-500 hover:underline"
          >
            Xem tất cả
          </button>
        </div>
        <div className="space-y-3">
          {recentPrintJobs.map((job, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded-md"
            >
              <div className="flex items-center space-x-3">
                <i
                  className={`${getFileIcon(
                    job.filename.split(".").pop() || ""
                  )} text-xl text-blue-500`}
                ></i>
                <div>
                  <p className="font-medium">{job.filename}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(job.time), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                {job.page} trang, {job.copy} bản
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
