import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Input, message as antdMessage } from "antd";

interface EducationType {
  _id: string;
  title: string;
}

const Education = () => {
  const [name, setName] = useState<string>("");
  const [educations, setEducations] = useState<EducationType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedEducation, setSelectedEducation] = useState<EducationType | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  const fetchEducations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/v1/faculty/education`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEducations(response.data.data);
    } catch (err) {
      console.error("Educationlarni olishda xatolik:", err);
      setError("Educationlarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/v1/faculty/education`,
        { title: name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      antdMessage.success("Education muvaffaqiyatli qo‘shildi!");
      setName("");
      fetchEducations();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      antdMessage.error("Xatolik! Education qo‘shilmadi.");
    }
  };

  const showUpdateModal = (education: EducationType) => {
    setSelectedEducation(education);
    setEditedTitle(education.title);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API}/api/v1/faculty/education/${selectedEducation?._id}`,
        { title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsUpdateModalVisible(false);
      setSelectedEducation(null);
      fetchEducations();
      antdMessage.success("Education muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Update xatoligi:", error);
      antdMessage.error("Update bajarilmadi!");
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedEducation(null);
  };

  const showDeleteModal = (education: EducationType) => {
    setSelectedEducation(education);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/api/v1/faculty/education/${selectedEducation?._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsDeleteModalVisible(false);
      setSelectedEducation(null);
      fetchEducations();
      antdMessage.success("Education o‘chirildi!");
    } catch (error) {
      console.error("Delete xatoligi:", error);
      antdMessage.error("O‘chirishda xatolik yuz berdi.");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setSelectedEducation(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Ta'lim Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="w-full md:col-span-2">
          <label
            htmlFor="name"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Ta'lim nomi
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Education nomi"
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Barcha Educationlar</h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid max-md:grid-cols-1 max-xl:grid-cols-2 xl:grid-cols-3 gap-6">
            {educations.map((education) => (
              <div
                key={education._id}
                className="w-full flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">{education.title}</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-600 bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                    onClick={() => showUpdateModal(education)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-600 bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 dark:text-gray-300 px-3 py-1 rounded-md transition-all duration-300"
                    onClick={() => showDeleteModal(education)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPDATE MODAL */}
      <Modal
        title="Educationni Tahrirlash"
        open={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Yangi education nomi"
        />
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        title="Educationni o‘chirish"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Ha, o‘chirish"
        cancelText="Yo‘q"
      >
        <p>
          {selectedEducation ? `"${selectedEducation.title}" educationini o‘chirmoqchimisiz?` : ""}
        </p>
      </Modal>
    </div>
  );
};

export default Education;