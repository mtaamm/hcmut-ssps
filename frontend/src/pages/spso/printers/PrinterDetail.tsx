import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import {
  GetPrinterDetailResponse,
  PrinterDetails,
  PrintJob,
  spsoAPI,
} from "../../../axios/spso";
import { Paginator } from "primereact/paginator";

const emptyPrinterDetails: PrinterDetails = {
  id: "",
  name: "",
  machine_type: "",
  floor: 0,
  building: "",
  status: "disable",
  two_side: false,
  color: false,
  page_size: [],
  print_jobs: [],
};

const PrinterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [printer, setPrinter] = useState<PrinterDetails>(emptyPrinterDetails);
  const [first, setFirst] = useState(0); // Vị trí đầu tiên của trang
  const [rows, setRows] = useState(10);

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: GetPrinterDetailResponse | undefined =
        await spsoAPI.getPrinterDetail(id ? id : "");
      console.log(response);
      if (response?.status === "success") setPrinter(response.data);
    };
    fetchData();
  }, [id]);

  if (!printer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Đang tải thông tin máy in...</p>
      </div>
    );
  }

  const renderHeader = () => (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">
        Chi tiết máy in {printer.name}
      </h1>
      <Button
        label="Quay lại"
        icon="pi pi-arrow-left"
        className="p-button-outlined p-button-sm"
        onClick={() => history.back()}
      />
    </div>
  );

  const pageSizeTemplate = () =>
    printer.page_size.map((size) => (
      <div key={size.page_size} className="flex justify-between border-b py-1">
        <span className="font-semibold">{size.page_size}</span>
        <span>{size.current_page} trang</span>
      </div>
    ));

  const statusTemplate = (rowData: PrintJob) => {
    const statusMap = {
      progress: { color: "orange", label: "Đang xử lý" },
      success: { color: "green", label: "Thành công" },
      fail: { color: "red", label: "Thất bại" },
    };

    const status = rowData.status;
    const { color, label } = statusMap[status];

    return (
      <div className="flex items-center space-x-2">
        <span style={{ color }}>{label}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {renderHeader()}
      <div className="bg-white shadow-md rounded-lg p-6 mt-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Thông tin máy in
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Tên:</strong> {printer.name}
            </p>
            <p>
              <strong>Kiểu máy:</strong> {printer.machine_type}
            </p>
            <p>
              <strong>Vị trí:</strong> {printer.building} - Tầng {printer.floor}
            </p>
          </div>
          <div>
            <p>
              <strong>Trạng thái:</strong>
              <Tag
                value={printer.status === "enable" ? "Hoạt động" : "Vô hiệu"}
                severity={printer.status === "enable" ? "success" : "danger"}
              />
            </p>
            <p>
              <strong>Hỗ trợ in hai mặt:</strong>{" "}
              {printer.two_side ? "Có" : "Không"}
            </p>
            <p>
              <strong>Hỗ trợ in màu:</strong> {printer.color ? "Có" : "Không"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold ">Lượng giấy:</h3>
          {pageSizeTemplate()}
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Danh sách lệnh in
        </h2>
        <DataTable value={printer.print_jobs} className="mt-4">
          <Column field="mssv" header="MSSV" sortable></Column>
          <Column
            field="filename"
            header="Tên tệp"
            sortable
            body={(rowData) => (
              <span
                className="block max-w-[200px] truncate"
                title={rowData.filename}
              >
                {rowData.filename}
              </span>
            )}
          ></Column>
          <Column
            field="time"
            header="Thời gian"
            sortable
            body={(rowData) =>
              new Date(rowData.time).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            }
          ></Column>
          <Column field="page_size" header="Khổ giấy" sortable></Column>
          <Column field="page" header="Số trang" sortable></Column>
          <Column field="copy" header="Bản sao" sortable></Column>
          <Column
            field="status"
            header="Trạng thái"
            body={statusTemplate}
          ></Column>
        </DataTable>

        <Paginator
          first={first}
          rows={rows}
          totalRecords={printer.print_jobs.length}
          onPageChange={onPageChange}
          rowsPerPageOptions={[10, 20, 30, 50]}
        />
      </div>
    </div>
  );
};

export default PrinterDetail;
