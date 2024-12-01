import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import {
  GetStudentDetailResponse,
  PrintJob,
  spsoAPI,
  StudentDetails,
} from "../../../axios/spso";

const emptyStudent: StudentDetails = {
  name: "Nguyễn Đoàn Minh Tâm",
  mssv: 2213026,
  total_page: 1884,
  total_print_job: 38,
  progress_print_job: 16,
  success_print_job: 8,
  fail_print_job: 14,
  print_jobs: [],
};

const ManageStudent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetails>(emptyStudent);

  useEffect(() => {
    const fetchData = async () => {
      const response: GetStudentDetailResponse | undefined =
        await spsoAPI.getStudentDetail(id ? id : "");
      console.log(response);
      if (response?.status === "success") setStudent(response.data);
    };
    fetchData();
  }, []);

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
          className="p-button-outlined p-button-sm"
          onClick={() => navigate("/manage-activities")}
        />
      </div>

      {/* Student Info */}
      <div className="mb-6">
        <p>
          <strong>MSSV:</strong> {student.mssv}
        </p>
        <p>
          <strong>Số trang sở hữu:</strong> {student.total_page}
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
      </div>

      {/* History Table */}
      <div>
        <h2 className="text-lg font-bold mb-4">Lịch sử in</h2>
        <DataTable
          value={student.print_jobs}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 30, 50]}
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
