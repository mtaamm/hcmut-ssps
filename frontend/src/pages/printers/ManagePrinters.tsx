import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

export interface Printer {
  id: string;
  name: string;
  machine_type: string;
  page_size: string[];
  current_page: number;
  two_side: boolean;
  color: boolean;
  location: {
    floor: number;
    building: "H1" | "H2" | "H3" | "H6";
  };
  status: string;
}
const emptyPrinter: Printer = {
  id: "",
  name: "",
  machine_type: "",
  page_size: [],
  current_page: 2000,
  two_side: false,
  color: false,
  location: { floor: 0, building: "H1" },
  status: "enable",
};
const buildings = ["H1", "H2", "H3", "H6"];
const mockPrinters: Printer[] = Array.from({ length: 20 }, (_, i) => ({
  id: `printer-${i + 1}`,
  name: `Máy in ${i + 1}`,
  machine_type: `Loại ${(i % 3) + 1}`,
  page_size: ["A4", "A5"].slice(0, (i % 2) + 1), // Chọn A4 hoặc A4+A5
  current_page: Math.floor(Math.random() * 2000),
  two_side: i % 2 === 0,
  color: i % 3 === 0,
  location: {
    floor: Math.floor(Math.random() * 9), // Số tầng từ 0 đến 8
    building: buildings[i % buildings.length] as "H1" | "H2" | "H3" | "H6",
  },
  status: i % 2 === 0 ? "enable" : "disable",
}));

const ManagePrinters: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>(mockPrinters);

  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [newPrinter, setNewPrinter] = useState<Printer>(emptyPrinter);

  const pageSizeOptions = ["A3", "A4", "A5"];
  const buildingOptions = ["H1", "H2", "H3", "H6"];
  const floorOptions = Array.from({ length: 9 }, (_, i) => i);

  const renderStatus = (rowData: Printer) => (
    <span className={`status-badge ${rowData.status}`}>
      {rowData.status === "enable" ? "Kích hoạt" : "Vô hiệu hóa"}
    </span>
  );

  const renderActions = (rowData: Printer) => (
    <>
      <Button
        icon="pi pi-pencil"
        className="p-button-text p-button-sm"
        onClick={() => {
          setSelectedPrinter(rowData);
          setIsEditDialogVisible(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        className="p-button-text p-button-danger p-button-sm"
        onClick={() => {
          setSelectedPrinter(rowData);
          setIsDeleteDialogVisible(true);
        }}
      />
    </>
  );

  const handleAddPrinter = () => {
    if (
      newPrinter.name &&
      newPrinter.machine_type &&
      newPrinter.page_size.length > 0 &&
      newPrinter.location
    ) {
      const newId = (printers.length + 1).toString();
      const addedPrinter = { ...newPrinter, id: newId } as Printer;
      setPrinters([...printers, addedPrinter]);
      setIsAddDialogVisible(false);
      setNewPrinter(emptyPrinter);
    }
  };

  const togglePrinterStatus = () => {
    if (selectedPrinter) {
      const updatedPrinters = printers.map((printer) =>
        printer.id === selectedPrinter.id
          ? {
              ...printer,
              status: printer.status === "enable" ? "disable" : "enable",
            }
          : printer
      );
      setPrinters(updatedPrinters);
      setIsEditDialogVisible(false);
    }
  };

  const deletePrinter = () => {
    if (selectedPrinter) {
      const updatedPrinters = printers.filter(
        (printer) => printer.id !== selectedPrinter.id
      );
      setPrinters(updatedPrinters);
      setIsDeleteDialogVisible(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý máy in</h1>
        <Button
          label="Thêm máy in"
          icon="pi pi-plus"
          className="p-button-primary"
          onClick={() => setIsAddDialogVisible(true)}
        />
      </div>

      <DataTable
        value={printers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 20]}
      >
        <Column field="name" header="Tên máy in" />
        <Column field="machine_type" header="Loại máy" />
        <Column field="current_page" header="Số giấy" />
        <Column
          header="Vị trí"
          body={(rowData: Printer) =>
            `${rowData.location.building}-Tầng ${rowData.location.floor}`
          }
        />
        <Column header="Trạng thái" body={renderStatus} />
        <Column header="Thao tác" body={renderActions} />
      </DataTable>

      {/* Add Printer Dialog */}
      <Dialog
        header="Thêm máy in"
        visible={isAddDialogVisible}
        onHide={() => {
          setIsAddDialogVisible(false);
          setNewPrinter(emptyPrinter);
        }}
        footer={
          <Button
            label="Thêm"
            icon="pi pi-check"
            className="p-button-primary p-button-sm"
            onClick={handleAddPrinter}
          />
        }
      >
        {/* Tên máy in */}
        <div className="field">
          <label htmlFor="name" className="flex gap-2">
            Tên máy in
          </label>
          <InputText
            id="name"
            value={newPrinter.name || ""}
            onChange={(e) =>
              setNewPrinter({ ...newPrinter, name: e.target.value })
            }
          />
          {!newPrinter.name && (
            <div>
              <small className="text-red-500">Vui lòng nhập tên máy in</small>
            </div>
          )}
        </div>

        {/* Loại máy */}
        <div className="field mt-4">
          <label htmlFor="machineType" className="flex gap-2">
            Loại máy
          </label>
          <InputText
            id="machineType"
            value={newPrinter.machine_type || ""}
            onChange={(e) =>
              setNewPrinter({ ...newPrinter, machine_type: e.target.value })
            }
          />
          {!newPrinter.machine_type && (
            <div>
              <small className="text-red-500">Vui lòng nhập loại máy</small>
            </div>
          )}
        </div>

        {/* Khổ giấy hỗ trợ */}
        <div className="field mt-4">
          <label className="flex gap-2">Khổ giấy hỗ trợ</label>
          <MultiSelect
            value={newPrinter.page_size || []}
            options={pageSizeOptions}
            onChange={(e) =>
              setNewPrinter({ ...newPrinter, page_size: e.value })
            }
            placeholder="Chọn khổ giấy"
          />
          {newPrinter.page_size.length === 0 && (
            <div>
              <small className="text-red-500">
                Vui lòng chọn ít nhất một khổ giấy
              </small>
            </div>
          )}
        </div>

        {/* Số giấy hiện tại */}
        <div className="field mt-4">
          <label htmlFor="currentPage" className="flex gap-2">
            Số giấy
          </label>
          <InputNumber id="currentPage" value={newPrinter.current_page} />
        </div>

        {/* Hỗ trợ in hai mặt */}
        <div className="field mt-4">
          <label>Hỗ trợ in hai mặt</label>
          <div className="flex align-items-center gap-2">
            <Checkbox
              inputId="twoSideYes"
              checked={newPrinter.two_side}
              onChange={(e) =>
                setNewPrinter({
                  ...newPrinter,
                  two_side: e.checked ? e.checked : false,
                })
              }
            />
            <label htmlFor="twoSideYes">Có</label>
            <Checkbox
              inputId="twoSideNo"
              checked={!newPrinter.two_side}
              onChange={(e) =>
                setNewPrinter({ ...newPrinter, two_side: !e.checked })
              }
            />
            <label htmlFor="twoSideNo">Không</label>
          </div>
        </div>

        {/* Hỗ trợ in màu */}
        <div className="field mt-4">
          <label>Hỗ trợ in màu</label>
          <div className="flex align-items-center gap-2">
            <Checkbox
              inputId="colorYes"
              checked={newPrinter.color}
              onChange={(e) =>
                setNewPrinter({
                  ...newPrinter,
                  color: e.checked ? e.checked : false,
                })
              }
            />
            <label htmlFor="colorYes">Có</label>
            <Checkbox
              inputId="colorNo"
              checked={!newPrinter.color}
              onChange={(e) =>
                setNewPrinter({
                  ...newPrinter,
                  color: !e.checked,
                })
              }
            />
            <label htmlFor="colorNo">Không</label>
          </div>
        </div>

        {/* Vị trí máy in */}
        <div className="field mt-4">
          <label>Vị trí máy in</label>
          <div className="flex align-items-center gap-4">
            {/* Tòa nhà */}
            <Dropdown
              value={newPrinter.location?.building}
              options={buildingOptions}
              onChange={(e) =>
                setNewPrinter({
                  ...newPrinter,
                  location: { ...newPrinter.location, building: e.value },
                })
              }
              placeholder="Chọn tòa nhà"
            />
            {/* Tầng */}
            <Dropdown
              value={newPrinter.location?.floor}
              options={floorOptions}
              onChange={(e) =>
                setNewPrinter({
                  ...newPrinter,
                  location: { ...newPrinter.location, floor: e.value },
                })
              }
              placeholder="Chọn tầng"
            />
          </div>
          {(!newPrinter.location?.building ||
            newPrinter.location?.floor === undefined) && (
            <span className="text-red-500">Vui lòng chọn vị trí máy in</span>
          )}
        </div>
      </Dialog>

      {/* Edit Printer Dialog */}
      {selectedPrinter && (
        <Dialog
          header="Chỉnh sửa máy in"
          visible={isEditDialogVisible}
          onHide={() => {
            setIsEditDialogVisible(false);
            setSelectedPrinter(null);
          }}
          footer={
            <Button
              label="Lưu"
              className="p-button-sm"
              onClick={() => {
                setIsEditDialogVisible(false);
                setSelectedPrinter(null);
              }}
            />
          }
        >
          {/* Tên máy in (chỉ hiển thị, không chỉnh sửa) */}
          <div className="field">
            <label htmlFor="name">Tên máy in</label>
            <InputText id="name" value={selectedPrinter?.name || ""} disabled />
          </div>

          {/* Loại máy (chỉ hiển thị, không chỉnh sửa) */}
          <div className="field mt-4">
            <label htmlFor="machineType">Loại máy</label>
            <InputText
              id="machineType"
              value={selectedPrinter?.machine_type || ""}
              disabled
            />
          </div>

          {/* Khổ giấy hỗ trợ (chỉ hiển thị, không chỉnh sửa) */}
          <div className="field mt-4">
            <label>Khổ giấy hỗ trợ</label>
            <MultiSelect
              value={selectedPrinter?.page_size || []}
              options={pageSizeOptions}
              disabled
            />
          </div>

          {/* Số giấy hiện tại (có thể chỉnh sửa) */}
          <div className="field mt-4">
            <label htmlFor="currentPage">Số giấy</label>
            <InputNumber
              id="currentPage"
              value={selectedPrinter?.current_page}
              onValueChange={(e) =>
                setSelectedPrinter({
                  ...selectedPrinter,
                  current_page: e.value ?? 0,
                })
              }
              min={0}
              max={2000}
            />
          </div>

          {/* Hỗ trợ in hai mặt (chỉ hiển thị, không chỉnh sửa) */}
          <div className="field mt-4">
            <label>Hỗ trợ in hai mặt</label>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="twoSide"
                checked={selectedPrinter?.two_side || true}
                disabled
              />
              <label htmlFor="twoSide">
                {selectedPrinter?.two_side ? "Có" : "Không"}
              </label>
            </div>
          </div>

          {/* Hỗ trợ in màu (chỉ hiển thị, không chỉnh sửa) */}
          <div className="field mt-4">
            <label>Hỗ trợ in màu</label>
            <div className="flex align-items-center gap-2">
              <Checkbox
                inputId="color"
                checked={selectedPrinter?.color || true}
                disabled
              />
              <label htmlFor="color">
                {selectedPrinter?.color ? "Có" : "Không"}
              </label>
            </div>
          </div>

          {/* Vị trí máy in (có thể chỉnh sửa) */}
          <div className="field mt-4">
            <label>Vị trí máy in</label>
            <div className="flex align-items-center gap-4">
              {/* Tòa nhà */}
              <Dropdown
                value={selectedPrinter?.location.building}
                options={buildingOptions}
                onChange={(e) =>
                  setSelectedPrinter({
                    ...selectedPrinter,
                    location: {
                      ...selectedPrinter.location,
                      building: e.value,
                    },
                  })
                }
                placeholder="Chọn tòa nhà"
              />
              {/* Tầng */}
              <Dropdown
                value={selectedPrinter?.location.floor}
                options={floorOptions}
                onChange={(e) =>
                  setSelectedPrinter({
                    ...selectedPrinter,
                    location: {
                      ...selectedPrinter.location,
                      floor: e.value,
                    },
                  })
                }
                placeholder="Chọn tầng"
              />
            </div>
            {(!selectedPrinter?.location.building ||
              selectedPrinter?.location.floor === undefined) && (
              <span className="text-red-500">Vui lòng chọn vị trí máy in</span>
            )}
          </div>

          {/* Toggle trạng thái máy in */}
          <div className="field mt-4">
            <Button
              label={
                selectedPrinter?.status === "enable"
                  ? "Vô hiệu hóa"
                  : "Kích hoạt"
              }
              className={`p-button-sm ${
                selectedPrinter?.status === "enable"
                  ? "p-button-danger"
                  : "p-button-success"
              }`}
              onClick={togglePrinterStatus}
            />
          </div>
        </Dialog>
      )}

      {/* Delete Printer Dialog */}
      <Dialog
        header="Xóa máy in"
        visible={isDeleteDialogVisible}
        onHide={() => setIsDeleteDialogVisible(false)}
        footer={
          <Button
            label="Xóa"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={deletePrinter}
          />
        }
      >
        {selectedPrinter && (
          <p>Bạn có chắc chắn muốn xóa máy in {selectedPrinter.name}?</p>
        )}
      </Dialog>
    </div>
  );
};

export default ManagePrinters;
