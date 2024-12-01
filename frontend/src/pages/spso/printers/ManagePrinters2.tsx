import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {
  GetAllResponse,
  Printer,
  PrinterParam,
  spsoAPI,
} from "../../../axios/spso";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";

const ManagePrinters: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [printerForm, setPrinterForm] = useState<PrinterParam>({
    name: "",
    machine_type: "",
    floor: 0,
    building: "H1",
    two_side: false,
    color: false,
    page_size: [],
  });

  const [submit, setSubmit] = useState<boolean>(false);
  const toast = useRef<Toast | null>(null);

  const buildingOptions = ["H1", "H2", "H3", "H6"];
  const floorOptions = Array.from({ length: 9 }, (_, i) => i);

  const [first, setFirst] = useState(0); // Vị trí đầu tiên của trang
  const [rows, setRows] = useState(10);
  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    const response: GetAllResponse | undefined = await spsoAPI.getAll();
    if (response?.status === "success") setPrinters(response.data);
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const renderPageSizeInput = (size: string) => {
    const isChecked = printerForm.page_size.some((ps) => ps.page_size === size);

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          inputId={`checkbox-${size}`}
          checked={isChecked} // Xác định trạng thái đã chọn
          onChange={(e) => {
            if (e.checked) {
              setPrinterForm((prev) => ({
                ...prev,
                page_size: [
                  ...prev.page_size,
                  { page_size: size, current_page: 0 },
                ],
              }));
            } else {
              setPrinterForm((prev) => ({
                ...prev,
                page_size: prev.page_size.filter((ps) => ps.page_size !== size),
              }));
            }
          }}
        />
        <InputNumber
          value={
            printerForm.page_size.find((ps) => ps.page_size === size)
              ?.current_page || 0
          }
          disabled={!isChecked} // Vô hiệu hóa nếu chưa chọn
          onValueChange={(e) => {
            setPrinterForm((prev) => ({
              ...prev,
              page_size: prev.page_size.map((ps) =>
                ps.page_size === size
                  ? { ...ps, current_page: e.value || 0 }
                  : ps
              ),
            }));
          }}
        />
      </div>
    );
  };

  const handleAddPrinter = async () => {
    try {
      const { name, machine_type, page_size } = printerForm;
      if (!name || !machine_type || page_size.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "Cảnh báo",
          detail: "Chưa điền đủ thông tin",
        });
        return;
      }
      const response = await spsoAPI.create(printerForm);
      if (response?.status === "success") {
        toast.current?.show({
          severity: "success",
          summary: "Thành công",
          detail: response.message,
        });
        setShowAddDialog(false);
        loadPrinters();
        setSubmit(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold">Quản lý máy in</h1>
        <Button
          label="Add Printer"
          icon="pi pi-plus"
          className="mb-4"
          onClick={() => setShowAddDialog(true)}
        />
      </div>

      <DataTable
        value={printers.slice(first, first + rows)}
        className="shadow-lg"
      >
        <Column
          field="name"
          header="Tên máy in"
          bodyClassName="w-30 overflow-hidden text-ellipsis"
        />
        <Column
          field="machine_type"
          header="Kiểu máy"
          bodyClassName="w-30 overflow-hidden text-ellipsis"
        />
        <Column
          field="time"
          header="Thời gian thêm"
          body={(rowData) =>
            new Date(rowData.time).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          }
        />
        <Column
          field="page_size"
          header="Lượng giấy"
          body={(rowData) =>
            rowData.page_size.reduce(
              (sum: number, ps: { page_size: string; current_page: number }) =>
                sum + ps.current_page,
              0
            )
          }
        />
        <Column
          field="location"
          header="Vị trí"
          body={(rowData) => `${rowData.building} - Tầng ${rowData.floor}`}
        />
        <Column
          field="status"
          header="Trạng thái"
          body={(rowData) =>
            rowData.status === "enable" ? "Hoạt động" : "Vô hiệu"
          }
        />
        <Column
          header="Thao tác"
          body={(rowData) => (
            <div className="flex gap-2">
              <div
                className="pi pi-pencil text-blue-600 cursor-pointer"
                onClick={() => {
                  setSelectedPrinter(rowData);
                  setShowEditDialog(true);
                }}
              />
              <div
                className="pi pi-power-off text-gray-600 cursor-pointer"
                onClick={() => {}}
              />
              <div
                className="pi pi-trash text-red-600 cursor-pointer"
                onClick={() => {}}
              />
            </div>
          )}
        />
        <Column
          header="Chi tiết"
          body={(rowData) => (
            <Link
              to={`/printer-detail/${rowData.id}`}
              className="text-blue-500 hover:underline"
            >
              Chi tiết
            </Link>
          )}
        />
      </DataTable>

      <Paginator
        first={first}
        rows={rows}
        totalRecords={printers.length}
        onPageChange={onPageChange}
        rowsPerPageOptions={[10, 20, 30, 50]}
      />
      <Dialog
        visible={showAddDialog}
        onHide={() => {
          setShowAddDialog(false);
          setSubmit(false);
        }}
        header="Thêm máy in"
        footer={
          <Button
            label="Thêm"
            icon="pi pi-check"
            className="p-button-sm"
            onClick={() => {
              setSubmit(true);
              handleAddPrinter();
            }}
          />
        }
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-bold">
            Tên máy in
          </label>
          <InputText
            placeholder="Printer Name"
            value={printerForm.name}
            onChange={(e) =>
              setPrinterForm({ ...printerForm, name: e.target.value })
            }
          />
          {submit && !printerForm.name && (
            <small className="text-red-600">
              Không được bỏ trống trường này
            </small>
          )}
          <label htmlFor="machine_type" className="font-bold">
            Kiểu máy
          </label>
          <InputText
            placeholder="Machine Type"
            value={printerForm.machine_type}
            onChange={(e) =>
              setPrinterForm({ ...printerForm, machine_type: e.target.value })
            }
          />
          {submit && !printerForm.machine_type && (
            <small className="text-red-600">
              Không được bỏ trống trường này
            </small>
          )}
          <label htmlFor="page_size" className="font-bold">
            Các khổ giấy hỗ trợ
          </label>
          {submit && printerForm.page_size.length === 0 && (
            <small className="text-red-600">
              Chọn ít nhất một khổ giấy hỗ trợ
            </small>
          )}
          <div className=" gap-4">
            <div>A3: {renderPageSizeInput("A3")}</div>
            <div>A4: {renderPageSizeInput("A4")}</div>
            <div>A5: {renderPageSizeInput("A5")}</div>
          </div>
          <label htmlFor="two_side" className="font-bold">
            Hỗ trợ in hai mặt
          </label>
          <Checkbox
            inputId="twoSideYes"
            checked={printerForm.two_side}
            onChange={(e) =>
              setPrinterForm({
                ...printerForm,
                two_side: e.checked ? e.checked : false,
              })
            }
          />
          <label htmlFor="color" className="font-bold">
            Hỗ trợ in màu
          </label>
          <Checkbox
            inputId="twoSideYes"
            checked={printerForm.color}
            onChange={(e) =>
              setPrinterForm({
                ...printerForm,
                color: e.checked ? e.checked : false,
              })
            }
          />
          <label htmlFor="localtion" className="font-bold">
            Vị trí
          </label>
          <label htmlFor="building">Tòa</label>
          <Dropdown
            value={printerForm.building}
            options={buildingOptions}
            onChange={(e) =>
              setPrinterForm({
                ...printerForm,
                building: e.value,
              })
            }
            placeholder="Chọn tòa nhà"
          />
          {/* Tầng */}
          <label htmlFor="floor">Tầng</label>
          <Dropdown
            value={printerForm.floor}
            options={floorOptions}
            onChange={(e) =>
              setPrinterForm({
                ...printerForm,
                floor: e.value,
              })
            }
            placeholder="Chọn tầng"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ManagePrinters;
