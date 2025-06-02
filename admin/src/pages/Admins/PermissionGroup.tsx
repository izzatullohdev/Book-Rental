import { Modal, Select, message as antdMessage } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Option } = Select;

interface GroupType {
  id: string;
  name: string;
}

interface PermissionType {
  id: string;
  code_name: string;
  name: string;
  table: string;
}

interface PermissionGroupType {
  id: string;
  groupInfo: {
    id: string;
    name: string;
  },
  permissionInfo: {
    id: string;
    name: string;
  }
}

const PermissionGroup = () => {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<GroupType[]>([]);
  const [permission, setPermission] = useState<PermissionType[]>([]);
  const [permissionGroup, setPermissionGroup] = useState<PermissionGroupType[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);

  // Guruhlarni olish
  useEffect(() => {
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
        console.error("Guruhlarni olishda xatolik:", err);
      }
    };
    fetchGroup();
  }, []);

  // Huquqlarni olish
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ data: PermissionType[] }>(
          `${import.meta.env.VITE_API}/api/permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPermission(response.data.data);
      } catch (err) {
        console.error("Huquqlarni olishda xatolik:", err);
      }
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ data: PermissionGroupType[] }>(
          `${import.meta.env.VITE_API}/api/group-permissions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        setPermissionGroup(response.data.data);
      } catch (err) {
        console.error("Huquqlarni olishda xatolik:", err);
      }
    };
    fetchPermission();
  }, []);

  // POST so‘rov
  const handleSubmit = async () => {
    if (!selectedGroupId || selectedPermissionIds.length === 0) {
      antdMessage.warning("Iltimos, guruh va kamida bitta huquqni tanlang!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API}/api/group-permissions/assign`, {
        group_id: selectedGroupId,
        permission_ids: selectedPermissionIds,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

      antdMessage.success("Huquqlar guruhga muvaffaqiyatli bog‘landi!");
      setSelectedGroupId("");
      setSelectedPermissionIds([]);
      setOpen(false);
    } catch (err) {
      console.error("Yuborishda xatolik:", err);
      Modal.error({
        title: "Xatolik",
        content: "Ma'lumot yuborishda xatolik yuz berdi.",
      });
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => setOpen(true)}
          className="dark:bg-gray-600 bg-gray-500 dark:text-gray-200 text-gray-100 rounded-lg px-4 py-2"
        >
          Guruh va Huquqni bog‘lash
        </button>
      </div>
      {/* Permission Group GET  */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="text-center py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider px-10">#</th>
            <th className="w-1/2 text-center py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider px-10">Guruh nomi</th>
            <th className="w-1/2 text-center py-3 text-sm font-medium text-gray-700 dark:text-white tracking-wider px-10">Huquqlar</th>
          </tr>
        </thead>
        {
          permissionGroup?.filter((item) => item.permissionInfo).map((item, index)=>(
            <tbody key={index+1} className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <tr>
                <td className="text-center py-4 text-sm text-gray-700 dark:text-gray-300 px-10 border-b dark:border-gray-500">{index+1}</td>
                <td className="text-center py-4 text-sm text-gray-700 dark:text-gray-300 px-10 border-b dark:border-gray-500">{item.groupInfo?.name}</td>
                <td className="text-center py-4 text-sm text-gray-700 dark:text-gray-300 px-10 border-b dark:border-gray-500">{item.permissionInfo?.name}</td>
              </tr>
            </tbody>
          ))
        }
      </table>
      {/* Permission Group POST  */}
      <Modal
        centered
        title="Huquq qo‘shish"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Saqlash"
        cancelText="Bekor qilish"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-700">Guruhni tanlang:</label>
          <Select
            placeholder="Guruh tanlang"
            className="w-full"
            value={selectedGroupId || undefined}
            onChange={(value) => setSelectedGroupId(value)}
          >
            {group.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-700">Huquqlarni tanlang:</label>
          <Select
            mode="multiple"
            placeholder="Huquqlarni tanlang"
            className="w-full"
            value={selectedPermissionIds}
            onChange={(values) => setSelectedPermissionIds(values)}
            maxTagCount="responsive"
            style={{ maxHeight: 200 }}
          >
            {permission.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default PermissionGroup;