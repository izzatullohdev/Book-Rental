import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Modal, Switch, Input, Button, message as antdMessage } from "antd";

interface GroupType {
  id: string;
  name: string;
  can_login: boolean;
}

const Group = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [canLogin, setCanLogin] = useState<boolean>(true);
  const [group, setGroup] = useState<GroupType[]>([]);

  const getToken = () => localStorage.getItem("token");

  const fetchGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ data: GroupType[] }>(
        `${import.meta.env.VITE_API}/api/groups/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      setGroup(response.data.data);
    } catch (err) {
      console.error("Yo'nalishlarni olishda xatolik:", err);
      antdMessage.error("Guruhlar olishda xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    fetchGroup();
  }, []);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  // Guruh qo'shish
  const handleSubmit = async () => {
    const token = getToken();
    if (!token) {
      antdMessage.error("Iltimos, avval tizimga kiring!");
      return;
    }

    try {
      const payload = {
        name,
        can_login: canLogin,
      };

      await axios.post(`${import.meta.env.VITE_API}/api/groups/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchGroup();

      setIsModalVisible(false);
      setName("");
      setCanLogin(true);
      antdMessage.success("Guruh muvaffaqiyatli qo'shildi!");
    } catch (error) {
      const err = error as AxiosError;
      if (err.response) {
        console.error("Guruh yaratishda xatolik:", err.response.data);
        antdMessage.error("Guruh yaratishda xatolik yuz berdi!");
      } else {
        console.error("Guruh yaratishda xatolik:", err.message);
        antdMessage.error("Guruh yaratishda xatolik yuz berdi!");
      }
    }
  };

  // Kirish ruxsatini almashtirish
  const toggleLoginPermission = (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const token = getToken();

    if (!token) {
      antdMessage.error("Iltimos, avval tizimga kiring!");
      return;
    }

    Modal.confirm({
      title: currentStatus ? "Ruxsatni olib tashlamoqchimisiz?" : "Ruxsat bermoqchimisiz?",
      content: currentStatus
        ? "Bu foydalanuvchi endi tizimga kira olmaydi."
        : "Bu foydalanuvchi tizimga kira oladi.",
      okText: currentStatus ? "Ruxsatni olib tashlash" : "Ruxsat berish",
      cancelText: "Bekor qilish",
      onOk: async () => {
        try {
          const currentGroup = group.find((item) => item.id === id);
          if (!currentGroup) {
            console.error("Guruh topilmadi");
            antdMessage.error("Guruh topilmadi");
            return;
          }

          const payload = {
            name: currentGroup.name,
            can_login: newStatus,
          };

          await axios.put(`${import.meta.env.VITE_API}/api/groups/${id}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setGroup((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, can_login: newStatus } : item
            )
          );
          antdMessage.success("Ruxsat muvaffaqiyatli yangilandi!");
        } catch (error) {
          const err = error as AxiosError;
          if (err.response) {
            console.error("Xatolik ma'lumotlari:", err.response.data);
            antdMessage.error("Ruxsatni yangilashda xatolik yuz berdi!");
          } else {
            console.error("Xatolik:", err.message);
            antdMessage.error("Ruxsatni yangilashda xatolik yuz berdi!");
          }
        }
      },
    });
  };

  return (
    <>
    <div className="my-10">
        <div className="flex items-center justify-end mb-6">
          <button
            className="dark:bg-gray-600 bg-gray-500 dark:text-gray-200 text-gray-100 rounded-lg px-4 py-2"
            onClick={handleOpenModal}
          >
            Guruh qo'shish
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="w-1/3 text-center py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider px-10">
                Guruh nomi
              </th>
              <th className="w-1/3 text-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider">
                Saytga kirish ruxsati
              </th>
              <th className="w-1/3 text-center px-6 py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider">
                Saytga kirish ruxsatini berish
              </th>
            </tr>   
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {group.map((item) => (
              <tr key={item.id}>
                <td className="text-center py-4 text-sm text-gray-700 dark:text-gray-300 px-10 border-b dark:border-gray-500">{item.name}</td>
                <td className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-500">{item.can_login ? "Bor" : "Yo‘q"}</td>
                <td className="text-center px-6 py-4 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-500">
                  <Button type="link" onClick={() => toggleLoginPermission(item.id, item.can_login)}>
                    {item.can_login ? "Ruxsatni olib tashlash" : "Ruxsat berish"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        centered
        title="Guruh qo‘shish"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-800 dark:text-white">Ism</label>
            <Input
              placeholder="Masalan: Kutubxonachi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-5">
            <label className="text-gray-800 dark:text-black">Saytga kira oladimi?</label>
            <Switch checked={canLogin} onChange={(checked) => setCanLogin(checked)} />
          </div>
          <div className="pt-4 text-right">
            <Button type="primary" onClick={handleSubmit}>Saqlash</Button>
          </div>
        </div>
      </Modal>
      </>
  )
}

export default Group;