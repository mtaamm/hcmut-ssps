import { useNavigate } from "react-router-dom";

const Header: React.FC<{ title?: string }> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-blue-600 text-white flex items-center justify-between px-4 py-2 shadow-md">
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => {
          if (title === "Student Dashboard") navigate("/home");
          else navigate("/manage-printers");
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HCMUT_official_logo.png/1200px-HCMUT_official_logo.png"
          alt="Logo"
          className="h-8 w-8 bg-white"
        />
        <span className="text-xl font-bold">HCMUT_SSPS</span>
      </div>
      {title && <span className="text-lg">{title}</span>}
    </header>
  );
};

export default Header;
