import React, { useRef, useState } from "react";
import { userAPI } from "../../axios/user";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

const Login: React.FC = () => {
  const toast = useRef<Toast | null>(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await userAPI.login(username, password);
    if (response) {
      localStorage.setItem("user", JSON.stringify(response));
      if (response.role === "student") navigate("/home");
      else navigate("/manage-printers");
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: "Đăng nhập thất bại, hãy kiểm tra và thử lại",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Toast ref={toast} />
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Đăng nhập bằng tài khoản BKNetID
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mật khẩu"
            />
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
