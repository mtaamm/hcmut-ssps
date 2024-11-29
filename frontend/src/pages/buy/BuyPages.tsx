import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Link } from "react-router-dom";

const BuyPagesPage: React.FC = () => {
  // Trạng thái
  const [pagesToBuy, setPagesToBuy] = useState<number>(10); // Mặc định là 10 trang
  const [paymentMethod, setPaymentMethod] = useState<string>("ocb"); // Phương thức thanh toán

  // Giá tiền
  const pricePerPage = 500; // Đơn giá mỗi trang in (500 VND)
  const remainingPages = 100; // Số trang còn lại (dữ liệu giả lập)

  // Tính tổng tiền
  const totalPrice = pagesToBuy * pricePerPage;

  // Hàm xử lý khi thay đổi số trang cần mua
  const handlePagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < 10) value = 10; // Giới hạn số trang mua tối thiểu là 10
    setPagesToBuy(value);
  };

  // Hàm xử lý khi nhấn nút thanh toán
  const handlePayment = () => {
    alert(`Thanh toán ${totalPrice} VND qua ${paymentMethod}`);
  };

  return (
    <div className="p-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Số trang còn lại" className="col-12 sm:col-6">
          <p>{remainingPages} trang</p>
        </Card>

        {/* Card nhập số trang cần mua */}
        <Card title="Nhập số trang cần mua" className="col-12 sm:col-6">
          <InputText
            value={String(pagesToBuy)} // Chuyển đổi pagesToBuy thành string khi truyền vào value
            onChange={handlePagesChange}
            type="number"
            min={10}
            placeholder="Số trang cần mua"
            className="w-full"
          />
          <p className="mt-2">Tổng tiền: {totalPrice} VND</p>
        </Card>
      </div>

      {/* Phương thức thanh toán */}
      <div className="mt-4">
        <h3>Phương thức thanh toán</h3>
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
          disabled={pagesToBuy < 10 || totalPrice <= 0} // Disable nếu số trang nhỏ hơn 10
        />
      </div>
    </div>
  );
};

export default BuyPagesPage;
