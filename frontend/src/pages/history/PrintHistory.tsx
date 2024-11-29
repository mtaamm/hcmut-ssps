import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

const HistoryPrintPage: React.FC = () => {
  // Dữ liệu giả lập
  const historyData = Array.from({ length: 20 }, (_, index) => ({
    filename: `File ${index + 1}`,
    time: new Date().toISOString(),
    printer_name: `Printer ${(index % 3) + 1}`,
    page: Math.floor(Math.random() * 100 + 1),
    status: ["progress", "success", "fail"][index % 3],
  }));

  // Trạng thái phân trang
  const [first, setFirst] = useState(0); // Vị trí đầu tiên của trang
  const [rows, setRows] = useState(5); // Số dòng mỗi trang

  // Cập nhật phân trang
  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // Template cho cột status
  const statusTemplate = (rowData: any) => {
    const statusMap = {
      progress: { color: "orange", icon: "pi pi-spinner", label: "Đang xử lý" },
      success: { color: "green", icon: "pi pi-check", label: "Thành công" },
      fail: { color: "red", icon: "pi pi-times", label: "Thất bại" },
    };

    const status: keyof typeof statusMap = rowData.status;
    const { color, icon, label } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <i className={`${icon}`} style={{ color }}></i>
        <span style={{ color }}>{label}</span>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lịch sử in ấn</h1>
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

      <DataTable
        value={historyData.slice(first, first + rows)}
        rows={rows}
        totalRecords={historyData.length}
        onPage={onPageChange}
      >
        <Column field="filename" header="Tên file" />
        <Column
          field="time"
          header="Thời gian"
          body={(rowData) => new Date(rowData.time).toLocaleString()}
        />
        <Column field="printer_name" header="Tên máy in" />
        <Column field="page" header="Số trang" />
        <Column field="status" header="Trạng thái" body={statusTemplate} />
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={historyData.length}
        onPageChange={onPageChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default HistoryPrintPage;
