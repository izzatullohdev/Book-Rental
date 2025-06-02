import axios from "axios";
import { message as antdMessage } from "antd";
import { useEffect, useState } from "react";

interface AutherType {
  id: number;
  name: string;
}

interface PermissionType {
  id: string;
  group_id: string;
  permission_id: string;
  permissionInfo: {
    id: string;
    code_name: string;
  }
}

const CreateBooks = () => {
  const [auther, setAuthers] = useState<AutherType[]>([]);
  const [userGroup, setUserGroup] = useState<PermissionType[]>([]);
  const [selectedAutherId, setSelectedAutherId] = useState<string | null>(null);
  const [bookName, setBookName] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState("");
  const [bookCode, setBookCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPermission = async () => {
    const token = localStorage.getItem("token"); 
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/group-permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setUserGroup(response.data.data);
    } catch (err) {
      console.error("Muallifni olishda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPermission();
  },[])

  const fetchAuthers = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      const response = await axios.get(`${import.meta.env.VITE_API}/api/auther`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-permission": permissionIds[0]
         }
      });
      setAuthers(response.data.data);
    } catch (err) {
      console.error("Autherlarni olishda xatolik:", err);
    }
  };
  useEffect(() => {
    if (userGroup.length > 0) {
      fetchAuthers();
    }
  }, [userGroup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookName || !selectedAutherId || !year || !page || !bookCode) {
      antdMessage.warning("Barcha maydonlarni to‘ldirish shart!");
      return;
    }

    const data = {
      name: bookName,
      auther_id: Number(selectedAutherId),
      year: Number(year),
      page: Number(page),
      book_code: bookCode,
    };

    try {
      const token = localStorage.getItem("token");

      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      await axios.post(`${import.meta.env.VITE_API}/api/books`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-permission": permissionIds[0]
        }
      });
      antdMessage.success("Kitob muvaffaqiyatli qo‘shildi!");
      setBookName("");
      setSelectedAutherId(null);
      setYear("");
      setPage("");
      setBookCode("");
    } catch (err) {
      console.error("Kitob qo‘shishda xatolik:", err);
      antdMessage.error("Kitob qo‘shishda xatolik yuz berdi.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-[80%] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">Kitob qo'shish</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="book" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
          Kitob nomini kiriting!
        </label>
        <input
          id="book"
          name="name"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="Sariq devni minib"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <div className="w-full md:col-span-2 mt-5">
          <label htmlFor="auther" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Yozuvchini tanlang!
          </label>
          <select
            id="auther"
            value={selectedAutherId || ""}
            onChange={(e) => setSelectedAutherId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white cursor-pointer px-4 py-2"
          >
            <option value="" disabled>
              Yozuvchini tanlang!
            </option>
            {auther.map((auther) => (
              <option key={auther.id} value={auther.id} className="cursor-pointer">
                {auther.name}
              </option>
            ))}
          </select>
        </div>
        <label htmlFor="year" className="block font-medium text-gray-700 dark:text-gray-300 mt-5">
          Kitob chiqarilgan yilni kiriting!
        </label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2024"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <label htmlFor="page" className="block font-medium text-gray-700 dark:text-gray-300 mt-5">
          Kitob necha betligini kiriting!
        </label>
        <input
          id="page"
          type="number"
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder="256"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <label htmlFor="book_code" className="block font-medium text-gray-700 dark:text-gray-300 mt-5">
          Kitob kodini kiriting!
        </label>
        <input
          id="book_code"
          value={bookCode}
          onChange={(e) => setBookCode(e.target.value)}
          placeholder="DUN2023-002"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md transition mt-10 px-6 py-2"
        >
          {loading ? "Qo'shilmoqda..." : "Qo'shish"}
        </button>
      </form>
    </div>
  );
};

export default CreateBooks;