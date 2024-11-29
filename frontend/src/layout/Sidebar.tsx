const Sidebar: React.FC<{
  items: { label: string; icon: string; to: string }[];
}> = ({ items }) => {
  return (
    <aside className="bg-gray-200 h-full w-64 flex-shrink-0 shadow-md">
      <ul className="space-y-2 p-4">
        {items.map((item) => (
          <li key={item.to}>
            <a
              href={item.to}
              className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              <i className={`${item.icon} text-blue-600`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
