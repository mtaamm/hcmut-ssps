import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { PrintHistory, studentAPI } from "../../../axios/student";

const HistoryPrintPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<PrintHistory[]>([]);
  const [first, setFirst] = useState(0); // Vị trí đầu tiên của trang
  const [rows, setRows] = useState(10); // Số dòng mỗi trang

  // Gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchHistoryData = async () => {
      const response: PrintHistory[] | undefined =
        await studentAPI.getPrintHistory();
      if (response) setHistoryData(response);
    };

    fetchHistoryData();
  }, []);

  // Cập nhật phân trang
  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // Template cho cột status
  const statusTemplate = (rowData: PrintHistory) => {
    const statusMap = {
      progress: { color: "orange", icon: "pi pi-spinner", label: "Đang xử lý" },
      success: { color: "green", icon: "pi pi-check", label: "Thành công" },
      fail: { color: "red", icon: "pi pi-times", label: "Thất bại" },
    };

    const status = rowData.status;
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
        style={{ marginTop: "10px" }}
        totalRecords={historyData.length}
        onPage={onPageChange}
      >
        {/* Cột tên file */}
        <Column
          field="filename"
          header="Tên file"
          body={(rowData) => (
            <span
              className="block max-w-[200px] truncate"
              title={rowData.filename}
            >
              {rowData.filename}
            </span>
          )}
        />

        {/* Cột thời gian */}
        <Column
          field="time"
          header="Thời gian"
          body={(rowData) =>
            new Date(rowData.time).toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />

        {/* Cột tên máy in */}
        <Column
          field="printer_name"
          header="Tên máy in"
          body={(rowData) => (
            <span
              className="block max-w-[150px] truncate"
              title={rowData.printer_name}
            >
              {rowData.printer_name}
            </span>
          )}
        />

        {/* Cột vị trí */}
        <Column
          field="printer_floor"
          header="Vị trí"
          body={(rowData) =>
            `${rowData.printer_building}-Tầng ${rowData.printer_floor}`
          }
        />

        {/* Cột số trang */}
        <Column
          field="page"
          header="Số trang"
          body={(rowData) => `${rowData.page} (${rowData.copy} bản sao)`}
        />

        {/* Cột trạng thái */}
        <Column field="status" header="Trạng thái" body={statusTemplate} />
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={historyData.length}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 30, 50]}
      />
    </div>
  );
};

export default HistoryPrintPage;
