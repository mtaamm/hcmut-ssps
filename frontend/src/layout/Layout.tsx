import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const user = { id: 1, role: "student" }; // User giả để kiểm tra layout

  useEffect(() => {
    // Điều hướng nếu không có user (chưa đăng nhập)
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]); // Khi user thay đổi, useEffect sẽ được gọi lại

  // Xác định sidebar items
  const studentSidebarItems = [
    { label: "Trang chủ", icon: "pi pi-home", to: "/home" },
    { label: "Tạo lệnh in", icon: "pi pi-print", to: "/create-print-job" },
    { label: "Lịch sử in", icon: "pi pi-history", to: "/print-history" },
    { label: "Mua giấy in", icon: "pi pi-shopping-cart", to: "/buy-pages" },
  ];

  const spsoSidebarItems = [
    { label: "Quản lý máy in", icon: "pi pi-cog", to: "/manage-printers" },
    {
      label: "Quản lý hoạt động in",
      icon: "pi pi-calendar",
      to: "/manage-activities",
    },
  ];

  // Nếu user có giá trị (đã đăng nhập), hiển thị layout bình thường
  if (user !== null) {
    return (
      <div className="flex flex-col h-screen">
        {/* Header */}
        <Header
          title={
            user.role === "student" ? "Student Dashboard" : "Admin Dashboard"
          }
        />

        <div className="flex flex-row h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-200 h-full flex-shrink-0 shadow-md">
            {user.role === "student" && <Sidebar items={studentSidebarItems} />}
            {user.role === "spso" && <Sidebar items={spsoSidebarItems} />}
          </div>

          {/* Main Content */}
          <main className="flex-grow bg-gray-100 p-4 overflow-auto">
            <Outlet />
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  return null; // Trả về null trong trường hợp không có user (để tránh render phần layout)
};

export default Layout;
