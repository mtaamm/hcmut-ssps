import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface PrintJob {
  filename: string;
  time: string; // ISO Date string
  printer_name: string;
  page: number;
  status: "progress" | "success" | "fail";
}

interface Student {
  id: string;
  name: string;
  page: number;
  total_print_job: number;
  success_print_job: number;
  progress_print_job: number;
  last_access_time: string; // ISO Date string
  history: PrintJob[];
}

const mockStudent: Student = {
  id: "2213020",
  name: "Nguyễn Văn A",
  page: 120,
  total_print_job: 30,
  success_print_job: 20,
  progress_print_job: 5,
  last_access_time: new Date().toISOString(),
  history: Array.from({ length: 20 }, (_, i) => ({
    filename: `Tài liệu ${i + 1}.pdf`,
    time: new Date(
      Date.now() - Math.floor(Math.random() * 1000000000)
    ).toISOString(),
    printer_name: `Printer ${(i % 3) + 1}`,
    page: Math.floor(Math.random() * 10) + 1,
    status: ["progress", "success", "fail"][Math.floor(Math.random() * 3)] as
      | "progress"
      | "success"
      | "fail",
  })),
};

const ManageStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>(mockStudent);

  const statusTemplate = (rowData: PrintJob) => {
    const statusMap = {
      progress: { label: "Đang xử lý", className: "text-blue-500" },
      success: { label: "Thành công", className: "text-green-500" },
      fail: { label: "Thất bại", className: "text-red-500" },
    };

    const status = statusMap[rowData.status];
    return <span className={status.className}>{status.label}</span>;
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Hoạt động của sinh viên {student.name}
        </h1>
        <Button
          label="Quay lại"
          icon="pi pi-arrow-left"
          className="p-button-sm"
          onClick={() => navigate("/manage-activities")}
        />
      </div>

      {/* Student Info */}
      <div className="mb-6">
        <p>
          <strong>MSSV:</strong> {student.id}
        </p>
        <p>
          <strong>Số trang sở hữu:</strong> {student.page}
        </p>
        <p>
          <strong>Tổng số lệnh in:</strong> {student.total_print_job}
        </p>
        <p>
          <strong>Lệnh in thành công:</strong> {student.success_print_job}
        </p>
        <p>
          <strong>Lệnh in đang xử lý:</strong> {student.progress_print_job}
        </p>
        <p>
          <strong>Lệnh in thất bại:</strong>{" "}
          {student.total_print_job -
            student.success_print_job -
            student.progress_print_job}
        </p>
        <p>
          <strong>Thời gian truy cập gần nhất:</strong>{" "}
          {new Date(student.last_access_time).toLocaleString()}
        </p>
      </div>

      {/* History Table */}
      <div>
        <h2 className="text-lg font-bold mb-4">Lịch sử in</h2>
        <DataTable
          value={student.history}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 20]}
        >
          <Column field="filename" header="Tên tài liệu" sortable></Column>
          <Column
            field="time"
            header="Thời gian"
            body={(rowData) => new Date(rowData.time).toLocaleString("vi-VN")}
            sortable
          ></Column>
          <Column field="printer_name" header="Máy in" sortable></Column>
          <Column field="page" header="Số trang" sortable></Column>
          <Column
            field="status"
            header="Trạng thái"
            body={statusTemplate}
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default ManageStudent;
