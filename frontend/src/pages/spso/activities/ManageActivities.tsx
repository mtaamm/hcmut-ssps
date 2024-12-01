import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import {
  GetStudentSummaryResponse,
  spsoAPI,
  StudentSummary,
} from "../../../axios/spso";

const ManageStudentActivity: React.FC = () => {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const handlePageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: GetStudentSummaryResponse | undefined =
        await spsoAPI.getStudentSummary();
      console.log(response);
      if (response?.status === "success") setStudents(response.data);
    };
    fetchData();
  }, []);

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
        rowsPerPageOptions={[10, 20, 30, 50]}
      >
        {/* Họ và tên */}
        <Column field="name" className="w-56" header="Họ và tên"></Column>
        {/* MSSV */}
        <Column field="mssv" header="MSSV" sortable></Column>
        {/* Số trang sở hữu */}
        <Column field="total_page" header="Số trang" sortable></Column>
        {/* Tổng số lệnh in */}
        <Column field="total_print_job" header="Số lệnh in" sortable></Column>
        {/* Đang chờ */}
        <Column field="progress_print_job" header="Đang chờ" sortable></Column>
        {/* Thành công */}
        <Column field="success_print_job" header="Thành công" sortable></Column>
        {/* Thất bại */}
        <Column header="Thất bại" field="fail_print_job"></Column>
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
