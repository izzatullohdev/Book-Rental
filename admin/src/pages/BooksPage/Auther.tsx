import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Input, message as antdMessage } from "antd";

interface GroupType {
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

const Auther = () => {
  const [name, setName] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [userGroup, setUserGroup] = useState<PermissionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
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

  const fetchGroups = async () => {
    setError(null);
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
      setGroups(response.data.data);
    } catch (err) {
      console.error("Muallifni olishda xatolik:", err);
      setError("Muallifni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userGroup.length > 0) {
      fetchGroups();
    }
  }, [userGroup]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      antdMessage.warning("Muallif kiritish shart!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);
      await axios.post(
        `${import.meta.env.VITE_API}/api/auther`,
        { name: name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-permission": permissionIds[0]
          }
        }
      );
      antdMessage.success("Muallif muvaffaqiyatli qo‘shildi!");
      setName("");
      await fetchGroups();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      antdMessage.error("Muallif qo'shilmadi!");
    }finally {
      setLoading(false);
    }
  };

  const showUpdateModal = (group: GroupType) => {
    setSelectedGroup(group);
    setEditedTitle(group.name);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = async () => {
    try {
      const token = localStorage.getItem("token");
      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name)
      await axios.put(
        `${import.meta.env.VITE_API}/api/auther/${selectedGroup?.id}`,
        { name: editedTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-permission": permissionIds[0]
          }
        }
      );
      setIsUpdateModalVisible(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error("Yangilashda xatolik yuz berdi:", error);
      antdMessage.error("Yangilashda xatolik yuz berdi!");
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedGroup(null);
  };

  const showDeleteModal = (group: GroupType) => {
    setSelectedGroup(group);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      const token = localStorage.getItem("token");
      const isRolesStr = localStorage.getItem("isRoles");
      const isRoles = isRolesStr ? JSON.parse(isRolesStr) : [];
      const matchedGroups = userGroup.filter(item => isRoles.includes(item.group_id));
      const permissionIds = matchedGroups?.map((item)=> item.permissionInfo.code_name);
      await axios.delete(
        `${import.meta.env.VITE_API}/api/auther/${selectedGroup?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-permission": permissionIds[0]
          }
        }
      );
      setIsDeleteModalVisible(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error("O'chirishda xatolik yuz berdi:", error);
      antdMessage.error("O‘chirishda xatolik yuz berdi!");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-[80%] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Kitob muallifini qo'shish</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="w-full md:col-span-2">
          <label
            htmlFor="auther"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Kitob muallifi
          </label>
          <input
            id="auther"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Cho'lpon"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
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
          {groups.length === 0
            ? "Kitob mualliflari yo'q!"
            : "Barcha kitob mualliflari"}
        </h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
           (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="w-full flex flex-col gap-5 items-start justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
                >
                  <h2 className="text-xl text-gray-700 dark:text-white line-clamp-1">{group.name}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-sm text-blue-500 hover:text-blue-600 bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                      onClick={() => showUpdateModal(group)}
                    >
                      Yangilash
                    </button>
                    <button
                      className="text-sm text-red-500 hover:text-red-600 bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                      onClick={() => showDeleteModal(group)}
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {/* UPDATE MODAL */}
      <Modal
        title="Muallifni Tahrirlash"
        open={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Yangi muallif nomi"
        />
      </Modal>

      <Modal
        title="Muallifni O‘chirish"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Ha, o‘chirish"
        cancelText="Bekor qilish"
      >
        <p>“{selectedGroup?.name}” muallifini o‘chirishga ishonchingiz komilmi?</p>
      </Modal>
    </div>
  );
};

export default Auther;