import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { PDFDocument } from "pdf-lib";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Steps } from "primereact/steps";
import { studentAPI, MatchPrinter } from "../../../axios/student"; // Import API & MatchPrinter interface
import { Student, userAPI } from "../../../axios/user";

const CreatePrintJob: React.FC = () => {
  const [user, setUser] = useState<Student | null>(null); // User lấy từ localStorage
  const [currentStep, setCurrentStep] = useState(1); // Bước hiện tại
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File được chọn
  const [filePages, setFilePages] = useState<number | null>(null); // Số trang trong file
  const [printSettings, setPrintSettings] = useState({
    paperSize: "A4",
    copies: 1,
    color: false,
    twoSide: false,
  }); // Thông số in
  const [availablePrinters, setAvailablePrinters] = useState<MatchPrinter[]>(
    []
  );
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null); // Máy in được chọn

  const toast = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = [{ label: "" }, { label: "" }, { label: "" }];

  // Lấy user từ localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Xử lý chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        const pages = await extractFilePages(file); // Giả sử hàm này trả về số trang
        setFilePages(pages);
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "File không hợp lệ",
          detail: "Chỉ chấp nhận định dạng PDF, DOCX, XLSX, CSV.",
        });
      }
    }
  };

  // Hàm giả định lấy số trang của file (cần thay thế bằng thực tế)
  const extractFilePages = async (file: File): Promise<number> => {
    const fileType = file.type;

    if (fileType === "application/pdf") {
      return await getPdfPageCount(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractDocxPages(file);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "text/csv"
    ) {
      return await extractExcelOrCsvPages(file);
    } else {
      throw new Error("Unsupported file type.");
    }
  };

  // Xử lý file PDF
  const getPdfPageCount = async (file: File): Promise<number> => {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    return pdfDoc.getPageCount(); // Số trang thực tế trong file PDF
  };

  // Xử lý file DOCX
  const extractDocxPages = async (file: File): Promise<number> => {
    // Logic này giả định số trang dựa trên độ dài text hoặc xử lý chi tiết hơn
    const docxArrayBuffer = await file.arrayBuffer();
    const docxText = new TextDecoder().decode(docxArrayBuffer);
    const pageEstimation = Math.ceil(docxText.length / 2000); // Ước tính 2000 ký tự mỗi trang
    return pageEstimation;
  };

  // Xử lý file Excel hoặc CSV
  const extractExcelOrCsvPages = async (file: File): Promise<number> => {
    const fileArrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileArrayBuffer, { type: "array" });
    const sheetNames = workbook.SheetNames;
    return sheetNames.length; // Mỗi sheet được coi là một trang
  };

  // Xử lý hủy
  const handleCancel = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setFilePages(null);
    setPrintSettings({
      paperSize: "A4",
      copies: 1,
      color: false,
      twoSide: false,
    });
    setSelectedPrinter(null);
    setAvailablePrinters([]);
    fileInputRef.current && (fileInputRef.current.value = "");
  };

  // Xử lý bước 2 -> bước 3
  const handleNextStep2 = async () => {
    const totalPages = (filePages || 0) * printSettings.copies;
    const pageSizeInfo = user?.page_size.find(
      (p) => p.page_size === printSettings.paperSize
    );
    const maxPages = pageSizeInfo ? pageSizeInfo.current_page : 0;
    if (totalPages > maxPages) {
      toast.current?.show({
        severity: "error",
        summary: "Không đủ giấy",
        detail: "Vui lòng mua thêm giấy in.",
      });
      return;
    }
    console.log(printSettings);
    const printers = await studentAPI.getMatchPrinters(
      printSettings.paperSize,
      filePages || 0,
      printSettings.copies,
      printSettings.twoSide,
      printSettings.color
    );
    console.log(printers);
    if (printers) setAvailablePrinters(printers);
    setCurrentStep(3);
  };

  // Xử lý tạo lệnh in
  const handleCreatePrintJob = async () => {
    if (!selectedPrinter) return;
    const response = await studentAPI.createPrintJob(
      selectedPrinter,
      selectedFile?.name || "",
      printSettings.paperSize,
      filePages || 0,
      printSettings.copies,
      printSettings.twoSide,
      printSettings.color
    );
    if (response?.status === "success") {
      toast.current?.show({
        severity: "success",
        summary: "Thành công",
        detail: "Lệnh in đã được tạo.",
      });
      handleCancel(); // Reset tất cả
      const userRelogin: Student | undefined = await userAPI.login(
        user ? user.username : "",
        user ? user.password : ""
      );
      console.log(userRelogin);
      if (userRelogin) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(userRelogin));
        setUser(userRelogin);
      }
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Lỗi",
        detail: response?.message,
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toast ref={toast} />
      <h1 className="text-2xl font-bold">Tạo lệnh in</h1>

      {/* Thanh tiến trình */}
      <div className="card">
        <Steps
          model={steps}
          activeIndex={currentStep - 1}
          onSelect={(e) => setCurrentStep(e.index + 1)}
          readOnly={true}
        />
      </div>

      {/* Bước 1 */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-xl font-bold">Bước 1: Chọn file</h2>
          <input
            type="file"
            accept=".docx,.pdf,.xlsx,.csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="mt-4"
          />
        </div>
      )}

      {/* Bước 2 */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-xl font-bold">Bước 2: Thiết lập thông số in</h2>
          <p className="text-gray-600 mt-2">File: {selectedFile?.name}</p>
          <p className="text-gray-600">Số trang: {filePages}</p>
          <div className="space-y-4 mt-4">
            <label className="block font-medium">Khổ giấy</label>
            <Dropdown
              value={printSettings.paperSize}
              options={[
                { label: "A4", value: "A4" },
                { label: "A3", value: "A3" },
                { label: "A5", value: "A5" },
              ]}
              onChange={(e) =>
                setPrintSettings({ ...printSettings, paperSize: e.value })
              }
              placeholder="Chọn khổ giấy"
            />
            <label className="block font-medium">Số bản sao</label>
            <InputNumber
              value={printSettings.copies}
              onValueChange={(e) =>
                setPrintSettings({ ...printSettings, copies: e.value || 1 })
              }
              min={1}
              showButtons
              placeholder="Số bản sao"
            />
            <label className="block font-medium">In màu</label>
            <Checkbox
              checked={printSettings.color}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  color: e.checked ? e.checked : false,
                })
              }
            ></Checkbox>
            <label className="block font-medium">In hai mặt</label>
            <Checkbox
              checked={printSettings.twoSide}
              onChange={(e) =>
                setPrintSettings({
                  ...printSettings,
                  twoSide: e.checked ? e.checked : false,
                })
              }
            >
              In hai mặt
            </Checkbox>
          </div>
        </div>
      )}

      {/* Bước 3 */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-bold">Bước 3: Chọn máy in</h2>
          <p className="text-gray-600 mt-2">File: {selectedFile?.name}</p>
          <p className="text-gray-600">Số trang: {filePages}</p>
          <p className="text-gray-600">Khổ giấy: {printSettings.paperSize}</p>
          <p className="text-gray-600">Số bảng sao: {printSettings.copies}</p>
          <p className="text-gray-600">
            In màu: {printSettings.color ? "có" : "không"}
          </p>
          <p className="text-gray-600">
            In hai mặt: {printSettings.twoSide ? "có" : "không"}
          </p>
          <div className="mt-4 space-y-4">
            {availablePrinters.length > 0 ? (
              availablePrinters.map((printer) => (
                <div
                  key={printer.id}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    selectedPrinter === printer.id
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedPrinter(printer.id)}
                >
                  <p className="font-medium">{printer.name}</p>
                  <p className="text-gray-600">
                    {printer.building}-Tầng {printer.floor}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Không có máy in phù hợp</p>
            )}
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="flex justify-end space-x-4 mt-4">
        <Button
          label="Hủy"
          className="p-button-danger"
          onClick={handleCancel}
        />
        {currentStep > 1 && (
          <Button
            label="Trở về"
            onClick={() => setCurrentStep(currentStep - 1)}
          />
        )}
        {currentStep < 3 && (
          <Button
            label="Tiếp tục"
            className="p-button-primary"
            onClick={
              currentStep === 2 ? handleNextStep2 : () => setCurrentStep(2)
            }
            disabled={
              (currentStep === 1 && !selectedFile) ||
              (currentStep === 2 && (!filePages || printSettings.copies < 1))
            }
          />
        )}
        {currentStep === 3 && (
          <Button
            label="Tạo lệnh in"
            className="p-button-success"
            onClick={handleCreatePrintJob}
            disabled={!selectedPrinter}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePrintJob;
