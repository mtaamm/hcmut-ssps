import React, { useRef, useState } from "react";

const CreatePrintJob: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1); // Bước hiện tại
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // File được chọn
  const [selectedPrinter, setSelectedPrinter] = useState<number | null>(null); // Máy in được chọn
  const [printSettings, setPrintSettings] = useState({
    paperSize: "A4",
    copies: 1,
    color: false,
  }); // Thông số in

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dữ liệu giả danh sách máy in
  const printers = [
    { id: 1, name: "Máy in 1", location: "Phòng 101" },
    { id: 2, name: "Máy in 2", location: "Phòng 102" },
    { id: 3, name: "Máy in 3", location: "Phòng 103" },
  ];

  // Xử lý chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      } else {
        alert("Định dạng file không được hỗ trợ!");
      }
    }
  };

  // Xử lý nút "Hủy"
  const handleCancel = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setSelectedPrinter(null);
    setPrintSettings({ paperSize: "A4", copies: 1, color: false });
    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Thanh tiến trình */}
      <div className="flex justify-between items-center">
        <div
          className={`flex-grow h-2 rounded-lg ${
            currentStep >= 1 ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex-grow h-2 rounded-lg mx-2 ${
            currentStep >= 2 ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`flex-grow h-2 rounded-lg ${
            currentStep >= 3 ? "bg-blue-500" : "bg-gray-300"
          }`}
        ></div>
      </div>

      {/* Bước 1: Chọn file */}
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

      {/* Bước 2: Chọn máy in */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-xl font-bold">Bước 2: Chọn máy in</h2>
          <p className="text-gray-600 mt-2">File: {selectedFile?.name}</p>
          <div className="space-y-4 mt-4">
            {printers.map((printer) => (
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
                <p className="text-gray-600 text-sm">{printer.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bước 3: Thiết lập thông số in */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-bold">Bước 3: Thiết lập thông số in</h2>
          <p className="text-gray-600 mt-2">File: {selectedFile?.name}</p>
          <p className="text-gray-600">
            Máy in:{" "}
            {printers.find((printer) => printer.id === selectedPrinter)?.name}
          </p>
          <div className="space-y-4 mt-4 max-w-sm">
            {/* Kích cỡ giấy */}
            <div>
              <label className="block font-medium">Kích cỡ giấy</label>
              <select
                value={printSettings.paperSize}
                onChange={(e) =>
                  setPrintSettings({
                    ...printSettings,
                    paperSize: e.target.value,
                  })
                }
                className="border p-2 rounded-md w-full"
              >
                <option value="A3">A3</option>
                <option value="A4">A4</option>
                <option value="A5">A5</option>
              </select>
            </div>

            {/* Số bản sao */}
            <div>
              <label className="block font-medium">Số bản sao</label>
              <input
                type="number"
                min={1}
                value={printSettings.copies}
                onChange={(e) =>
                  setPrintSettings({
                    ...printSettings,
                    copies: parseInt(e.target.value, 10),
                  })
                }
                className="border p-2 rounded-md w-full"
              />
            </div>

            {/* In màu */}
            <div>
              <label className="block font-medium">In màu</label>
              <input
                type="checkbox"
                checked={printSettings.color}
                onChange={(e) =>
                  setPrintSettings({
                    ...printSettings,
                    color: e.target.checked,
                  })
                }
                className="ml-2"
              />
            </div>
          </div>
        </div>
      )}

      {/* Nút điều hướng */}
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Hủy
        </button>
        {currentStep > 1 && (
          <button
            onClick={() =>
              currentStep === 2
                ? setCurrentStep(1)
                : setCurrentStep(currentStep - 1)
            }
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Trở về
          </button>
        )}
        {currentStep < 3 && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={
              (currentStep === 1 && !selectedFile) ||
              (currentStep === 2 && selectedPrinter === null)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Tiếp tục
          </button>
        )}
        {currentStep === 3 && (
          <button
            disabled={
              !selectedFile ||
              selectedPrinter === null ||
              printSettings.copies < 1
            }
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Tạo lệnh in
          </button>
        )}
      </div>
    </div>
  );
};

export default CreatePrintJob;
