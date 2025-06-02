import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Input, message as antdMessage } from "antd";

interface FacultyType {
  id: string;
  name: string;
}

interface KafedraType {
  id: string;
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

const Direction = () => {
  const [name, setName] = useState<string>("");
  const [faculties, setFaculties] = useState<FacultyType[]>([]);
  const [userGroup, setUserGroup] = useState<PermissionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [kafedras, setKafedras] = useState<KafedraType[]>([]);
  const [selectedKafedraId, setSelectedKafedraId] = useState<string | null>(null);

  const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(null);
  const [editedKafedraId, setEditedKafedraId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

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
      setError("Muallifni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPermission();
  },[])

  const fetchFaculties = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");

      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      const response = await axios.get(`${import.meta.env.VITE_API}/api/yonalish`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-permission": permissionIds[0]
        }
      });
      setFaculties(response.data.data);
    } catch (err) {
      console.error("Yo'nalishlarni olishda xatolik:", err);
      setError("Yo'nalishlarni olishda xatolik yuz berdi.");
    }
  };

  const fetchKafedras = async () => {
    try {
      const token = localStorage.getItem("token");

      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      const response = await axios.get(`${import.meta.env.VITE_API}/api/kafedra`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-permission": permissionIds[0]
        }
      });
      setKafedras(response.data.data);
    } catch (err) {
      console.error("Kafedralarni olishda xatolik:", err);
    }
  };

  useEffect(() => {
    if (userGroup.length > 0) {
      fetchFaculties();
      fetchKafedras();
    }
  }, [userGroup]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedKafedraId) {
      antdMessage.warning("Kafedrani tanlang!");
      return;
    }

    if (!name.trim() || !selectedKafedraId) {
      antdMessage.warning("Iltimos, yo'nalish nomini va kafedrani to‘liq to‘ldiring!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      await axios.post(
        `${import.meta.env.VITE_API}/api/yonalish`,
        { 
          name: name,
          kafedra_id: Number(selectedKafedraId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-permission": permissionIds[0]
          }
        }
      );
      antdMessage.success("Yo'nalish muvaffaqiyatli qo‘shildi!");
      setName("");
      setSelectedKafedraId(null);
      fetchFaculties();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      antdMessage.error("Yo'nalish qo‘shilmadi.");
    }
  };

  // UPDATE modalni ko'rsatish
  const showUpdateModal = (faculty: FacultyType) => {
    setSelectedFaculty(faculty);
    setEditedTitle(faculty.name);
    const matched = kafedras.find(k => k.name === faculty.name);
    setEditedKafedraId(matched?.id || null);
    setIsUpdateModalVisible(true);
  };

  // UPDATE saqlash
  const handleUpdateOk = async () => {
  if (!editedTitle.trim() && !editedKafedraId) {
    antdMessage.warning("Iltimos, yo'nalish nomi va kafedrani tanlang!");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const isRolesStr = localStorage.getItem("isRoles");
    const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
    const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
    const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

    await axios.put(
      `${import.meta.env.VITE_API}/api/yonalish/${selectedFaculty?.id}`,
      { 
        name: editedTitle,
        kafedra_id: Number(editedKafedraId),
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-permission": permissionIds[0]
        }
      }
    );
    setIsUpdateModalVisible(false);
    setSelectedFaculty(null);
    fetchFaculties();
    antdMessage.success("Yo'nalish muvaffaqiyatli yangilandi!");
  } catch (error) {
    console.error("Yangilashda xatolik:", error);
    antdMessage.error("Yangilash bajarilmadi!");
  }
};

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedFaculty(null);
  };

  // DELETE modalni ko'rsatish
  const showDeleteModal = (faculty: FacultyType) => {
    setSelectedFaculty(faculty);
    setIsDeleteModalVisible(true);
  };

  // DELETE tasdiqlash
  const handleDeleteOk = async () => {
    try {
      const token = localStorage.getItem("token");

      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);

      await axios.delete(
        `${import.meta.env.VITE_API}/api/yonalish/${selectedFaculty?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-permission": permissionIds[0]
          }
        }
      );
      setIsDeleteModalVisible(false);
      setSelectedFaculty(null);
      fetchFaculties();
      antdMessage.success("Yo'nalish o‘chirildi!");
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      antdMessage.error("O‘chirishda xatolik yuz berdi.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Yo'nalish Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="w-full md:col-span-2">
          <label htmlFor="direction" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Yo'nalish nomi
          </label>
          <input
            id="direction"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Marketing"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="w-full md:col-span-2">
          <label htmlFor="kafedra" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kafedrani tanlang!
          </label>
          <select
            id="kafedra"
            value={selectedKafedraId || ""}
            onChange={(e) => setSelectedKafedraId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          >
            <option value="" disabled>
              Kafedrani tanlang
            </option>
            {kafedras.map((kafedra) => (
              <option key={kafedra.id} value={kafedra.id}>
                {kafedra.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Qo'shilmoqda..." : "Qo'shish"}
          </button>
        </div>
      </form>
      <div className="mt-20">
        <h2 className="text-2xl font-medium mb-6 text-gray-800 dark:text-white">
          {faculties.length === 0 ? "Yo'nalishlar mavjud emas" : "Barcha yo'nalishlar"}
        </h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="w-full flex flex-col gap-5 items-start justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
              >
                <h2 className="text-xl text-gray-700 dark:text-white line-clamp-1">{faculty.name}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-600 bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                    onClick={() => showUpdateModal(faculty)}
                  >
                    Yangilash
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-600 bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                    onClick={() => showDeleteModal(faculty)}
                  >
                    O'chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* UPDATE MODAL */}
      <Modal
        title="Yo'nalishni Tahrirlash"
        open={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <div className="space-y-4">
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Yangi yo'nalish nomi"
          />
          <select
            value={editedKafedraId || ""}
            onChange={(e) => setEditedKafedraId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-white dark:text-gray-600 mt-4"
          >
            <option value="" disabled>Kafedrani tanlang</option>
            {kafedras.map((kafedra) => (
              <option key={kafedra.id} value={kafedra.id}>
                {kafedra.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>      
      {/* DELETE MODAL */}
      <Modal
        title="yo'nalishni o‘chirish"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="O‘chirish"
        cancelText="Yo‘q"
      >
        <p>
          {selectedFaculty ? `"${selectedFaculty.name}" Yo'nalishni o‘chirmoqchimisiz?` : ""}
        </p>
      </Modal>
    </div>
  );
};

export default Direction;