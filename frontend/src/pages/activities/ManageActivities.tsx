import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";

export interface Student {
  id: string;
  name: string;
  page: number;
  total_print_job: number;
  success_print_job: number;
  progress_print_job: number;
  last_access_time: string;
}

const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => {
  const total = Math.floor(Math.random() * 50); // Tổng số lệnh in
  const success = Math.floor(Math.random() * total); // Lệnh in thành công
  const progress = Math.floor(Math.random() * (total - success)); // Đang chờ

  return {
    id: `22130${i + 20}`,
    name: `Sinh viên ${i + 1}`,
    page: Math.floor(Math.random() * 200),
    total_print_job: total,
    success_print_job: success,
    progress_print_job: progress,
    last_access_time: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
  };
});

const ManageStudentActivity: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const handlePageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const calculateFailedJobs = (student: Student) => {
    return (
      student.total_print_job -
      student.success_print_job -
      student.progress_print_job
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Quản lí hoạt động in của sinh viên
        </h1>
      </div>

      <DataTable
        value={students}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        rows={rows}
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 20]}
      >
        {/* Họ và tên */}
        <Column field="name" header="Họ và tên" sortable></Column>
        {/* MSSV */}
        <Column field="id" header="MSSV" sortable></Column>
        {/* Số trang sở hữu */}
        <Column field="page" header="Số giấy" sortable></Column>
        {/* Tổng số lệnh in */}
        <Column field="total_print_job" header="Số lệnh in" sortable></Column>
        {/* Đang chờ */}
        <Column field="progress_print_job" header="Đang chờ" sortable></Column>
        {/* Thành công */}
        <Column field="success_print_job" header="Thành công" sortable></Column>
        {/* Thất bại */}
        <Column
          header="Thất bại"
          body={(rowData) => calculateFailedJobs(rowData)}
        ></Column>
        {/* Chi tiết */}
        <Column
          header="Chi tiết"
          body={(rowData) => (
            <Link
              to={`/manage-student-activity/${rowData.id}`}
              className="text-blue-600 hover:underline"
            >
              Chi tiết
            </Link>
          )}
        ></Column>
      </DataTable>
    </div>
  );
};

export default ManageStudentActivity;
