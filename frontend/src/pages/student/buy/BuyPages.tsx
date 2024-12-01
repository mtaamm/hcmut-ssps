import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Dropdown } from "primereact/dropdown";
import { Link } from "react-router-dom";
import { Student, userAPI } from "../../../axios/user";
import { studentAPI } from "../../../axios/student";
import { Toast } from "primereact/toast";

const BuyPagesPage: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [user, setUser] = useState<Student | null>(null);
  const [pagesToBuy, setPagesToBuy] = useState<number>(10); // Mặc định mua 10 trang
  const [pageSize, setPageSize] = useState<string>("A4"); // Khổ giấy mặc định là A4
  const [paymentMethod, setPaymentMethod] = useState<string>("ocb"); // Phương thức thanh toán mặc định

  // Đơn giá theo khổ giấy
  const priceMap: Record<string, number> = {
    A3: 800,
    A4: 500,
    A5: 300,
  };

  // Tính tổng tiền
  const totalPrice = pagesToBuy * priceMap[pageSize];

  // Lấy dữ liệu từ localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Hàm xử lý khi thay đổi số trang cần mua
  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < 10) value = 10; // Giới hạn số trang mua tối thiểu là 10
    setPagesToBuy(value);
  };

  // Hàm xử lý khi nhấn nút thanh toán
  const handlePayment = async () => {
    const response = await studentAPI.buyPage(pageSize, pagesToBuy);
    if (response?.status === "success") {
      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Đã thực hiện thành công!",
        life: 3000,
      });
      const userRelogin: Student | undefined = await userAPI.login(
        user ? user.username : "",
        user ? user.password : ""
      );
      console.log(userRelogin);
      if (userRelogin) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(userRelogin));
        setUser(userRelogin);
      }
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      {/* Tiêu đề */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mua thêm giấy in</h1>
        <div className="space-x-2">
          <Link to="/create-print-job">
            <Button
              label="Tạo lệnh in"
              icon="pi pi-print"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            />
          </Link>
        </div>
      </div>

      {/* Card hiển thị số trang còn lại */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card title="Số trang còn lại" className="col-12 sm:col-6">
          <ul>
            {user?.page_size.map((page) => (
              <li key={page.page_size}>
                <strong>{page.page_size}:</strong> {page.current_page} trang
              </li>
            ))}
          </ul>
        </Card>

        {/* Card chọn số lượng trang và khổ giấy */}
        <Card
          title="Chọn khổ giấy và số lượng cần mua"
          className="col-12 sm:col-6"
        >
          <div className="flex flex-wrap gap-4">
            {/* Trường chọn khổ giấy */}
            <div className="flex-1">
              <label htmlFor="pageSize" className="block font-bold mb-2">
                Khổ giấy
              </label>
              <Dropdown
                id="pageSize"
                value={pageSize}
                options={[
                  { label: "A3 (800 VND/trang)", value: "A3" },
                  { label: "A4 (500 VND/trang)", value: "A4" },
                  { label: "A5 (300 VND/trang)", value: "A5" },
                ]}
                onChange={(e) => setPageSize(e.value)}
                className="w-full"
              />
            </div>

            {/* Trường chọn số trang */}
            <div className="flex-1">
              <label htmlFor="pagesToBuy" className="block font-bold mb-2">
                Số trang cần mua
              </label>
              <InputText
                id="pagesToBuy"
                value={String(pagesToBuy)}
                onChange={handlePagesChange}
                type="number"
                min={10}
                placeholder="Số trang cần mua"
                className="w-full"
              />
            </div>
          </div>

          <p className="mt-2">
            <strong>Tổng tiền:</strong> {totalPrice} VND
          </p>
        </Card>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mt-4">
        <h3 className="font-bold">Phương thức thanh toán</h3>
        <div className="field-radiobutton">
          <RadioButton
            inputId="ocb"
            name="paymentMethod"
            value="ocb"
            checked={paymentMethod === "ocb"}
            onChange={(e) => setPaymentMethod(e.value)}
          />
          <label htmlFor="ocb">OCB</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="bkpay"
            name="paymentMethod"
            value="bkpay"
            checked={paymentMethod === "bkpay"}
            onChange={(e) => setPaymentMethod(e.value)}
          />
          <label htmlFor="bkpay">BKPay</label>
        </div>
      </div>

      {/* Nút thanh toán */}
      <div className="mt-4">
        <Button
          label="Thanh toán"
          icon="pi pi-credit-card"
          onClick={handlePayment}
          disabled={pagesToBuy < 10 || totalPrice <= 0}
          className="bg-blue-500 text-white hover:bg-blue-600"
        />
      </div>
    </div>
  );
};

export default BuyPagesPage;
