import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Input } from "antd";

interface GroupType {
  _id: string;
  title: string;
}

const Group = () => {
  const [name, setName] = useState<string>("");
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/v1/faculty/group`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data.data);
    } catch (err) {
      console.error("Guruhlarni olishda xatolik:", err);
      setError("Guruhlarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/v1/faculty/group`,
        { title: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      fetchGroups();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      alert("Xatolik! Guruh qo‘shilmadi.");
    }
  };

  // Update
  const showUpdateModal = (group: GroupType) => {
    setSelectedGroup(group);
    setEditedTitle(group.title);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API}/api/v1/faculty/group/${selectedGroup?._id}`,
        { title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsUpdateModalVisible(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error("Update xatoligi:", error);
      alert("Update bajarilmadi!");
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
      await axios.delete(
        `${import.meta.env.VITE_API}/api/v1/faculty/group/${selectedGroup?._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsDeleteModalVisible(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error("Delete xatoligi:", error);
      alert("O‘chirishda xatolik yuz berdi.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedGroup(null);
  };

  return (
    <div className="min-h-[80%] p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Guruh Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="w-full md:col-span-2">
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Guruh nomi
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Guruh nomi"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Saqlash
          </button>
        </div>
      </form>

      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {groups.length === 0
            ? "Guruhlar mavjud emas"
            : "Barcha Guruhlar"}
        </h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
           (
            <div className="grid max-md:grid-cols-1 max-xl:grid-cols-2 xl:grid-cols-3 gap-6">
              {groups.map((group) => (
                <div
                  key={group._id}
                  className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
                >
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-white">{group.title}</h2>
                  <div className="flex items-center space-x-2">
                    <button
                      className="text-sm text-blue-500 hover:text-blue-600 bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                      onClick={() => showUpdateModal(group)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm text-red-500 hover:text-red-600 bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                      onClick={() => showDeleteModal(group)}
                    >
                      Delete
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
        title="Guruhni Tahrirlash"
        open={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Yangi guruh nomi"
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        title="Guruhni o‘chirish"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Ha, o‘chirish"
        cancelText="Yo‘q"
      >
        <p>
          {selectedGroup ? `"${selectedGroup.title}" guruhini o‘chirmoqchimisiz?` : ""}
        </p>
      </Modal>
    </div>
  );
};

export default Group;