import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Input, message as antdMessage } from "antd";

interface FacultyType {
  id: string;
  name: string;
}

const Category = () => {
  const [name, setName] = useState<string>("");
  const [faculties, setFaculties] = useState<FacultyType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

  const fetchFaculties = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/api/category`);
      setFaculties(response.data.data);
    } catch (err) {
      console.error("Kafedralarni olishda xatolik:", err);
      setError("Kafedralarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/api/kafedra`,
        { name: name }
      );
      antdMessage.success("Kafedra muvaffaqiyatli qo‘shildi!");
      setName("");
      fetchFaculties();
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      antdMessage.error("Xatolik! Kafedra qo‘shilmadi.");
    }
  };

  // UPDATE
  const showUpdateModal = (faculty: FacultyType) => {
    setSelectedFaculty(faculty);
    setEditedTitle(faculty.name);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API}/api/kafedra/${selectedFaculty?.id}`,
        { name: editedTitle }
      );
      setIsUpdateModalVisible(false);
      setSelectedFaculty(null);
      fetchFaculties();
      antdMessage.success("Kafedra muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      antdMessage.error("Yangilash bajarilmadi!");
    }
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedFaculty(null);
  };

  // DELETE
  const showDeleteModal = (faculty: FacultyType) => {
    setSelectedFaculty(faculty);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/api/kafedra/${selectedFaculty?.id}`);
      setIsDeleteModalVisible(false);
      setSelectedFaculty(null);
      fetchFaculties();
      antdMessage.success("Kafedra o‘chirildi!");
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Kafedra Qo‘shish</h2>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div className="w-full md:col-span-2">
          <label htmlFor="name" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kafedra nomi
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Iqtisodiyot"
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
          {faculties.length === 0 ? "Kafedralar mavjud emas" : "Barcha Kafedralar"}
        </h2>
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">Yuklanmoqda...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
            {faculties.map((faculty) => (
              <div
                key={faculty.id}
                className="w-full flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-white">{faculty.name}</h2>
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
        title="Kafedrani Tahrirlash"
        open={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Yangi kafedra nomi"
        />
      </Modal>
      {/* DELETE MODAL */}
      <Modal
        title="Kafedrani o‘chirish"
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="O‘chirish"
        cancelText="Yo‘q"
      >
        <p>
          {selectedFaculty ? `"${selectedFaculty.name}" Kafedrani o‘chirmoqchimisiz?` : ""}
        </p>
      </Modal>
    </div>
  );
};

export default Category;