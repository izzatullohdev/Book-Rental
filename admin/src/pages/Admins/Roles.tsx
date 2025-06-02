import { useState, useEffect } from "react";
import Group from "./Group";
import Permission from "./Permission";
import PermissionGroup from "./PermissionGroup";

const SelectData = [
  { id: 1, title: "Guruh qo'shish" },
  { id: 2, title: "Huquq qo'shish" },
  { id: 3, title: "Guruh va Huquqni bog'lash" }
];

const Roles: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    const savedRole = localStorage.getItem("selectedRole");
    if (savedRole) {
      setSelectedRole(savedRole);
    } else {
      setSelectedRole("Guruh qo'shish");
    }
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedRole(value);
    localStorage.setItem("selectedRole", value);
  };

  return (
    <div className="min-h-[80%] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Xodimlarni boshqarish
        </h2>
        <div className="relative">
          <select
            onChange={(e) => handleSelectChange(e.target.value)}
            value={selectedRole}
            className="outline-none w-full appearance-none pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border dark:border-gray-400 rounded-lg px-4 py-2 cursor-pointer"
          >
            <option value="" disabled>Tanlang</option>
            {SelectData.map((item) => (
              <option key={item.id} value={item.title}>
                {item.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      {/* Tanlovga qarab komponent ko'rsatish */}
      {selectedRole === "Guruh qo'shish" && <Group />}
      {selectedRole === "Huquq qo'shish" && <Permission />}
      {selectedRole === "Guruh va Huquqni bog'lash" && <PermissionGroup />}
    </div>
  );
};

export default Roles;