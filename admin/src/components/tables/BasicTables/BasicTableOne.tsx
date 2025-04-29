import React, { useState } from "react";
import {Modal,Input} from "antd"   

// Kategoriya tipi
interface Category {
  id: number;
  name: string;
  createdAt: string;
}

const BasicTableOne: React.FC = () => {
  const [category, setCategory] = useState<Category[]>([
    { id: 1, name: "Category 1", createdAt: "2023-01-01" },
    { id: 2, name: "Category 2", createdAt: "2023-01-03" },
    { id: 3, name: "Category 3", createdAt: "2023-01-05" },
    { id: 4, name: "Category 4", createdAt: "2023-01-07" },
    { id: 5, name: "Category 5", createdAt: "2023-01-09" }
  ]);

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState<boolean>(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [updatedName, setUpdatedName] = useState<string>("");

  const showUpdateModal = (item: Category): void => {
    setCurrentCategory(item);
    setUpdatedName(item.name);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = (): void => {
    if (currentCategory) {
      setCategory((prevCategory) =>
        prevCategory.map((item) =>
          item.id === currentCategory.id ? { ...item, name: updatedName } : item
        )
      );
      setIsUpdateModalVisible(false);
      setCurrentCategory(null);
    }
  };

  const handleUpdateCancel = (): void => {
    setIsUpdateModalVisible(false);
    setCurrentCategory(null);
  };

  const showDeleteModal = (item: Category): void => {
    setCurrentCategory(item);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = (): void => {
    if (currentCategory) {
      setCategory((prevCategory) =>
        prevCategory.filter((item) => item.id !== currentCategory.id)
      );
      setIsDeleteModalVisible(false);
      setCurrentCategory(null);
    }
  };

  const handleDeleteCancel = (): void => {
    setIsDeleteModalVisible(false);
    setCurrentCategory(null);
  };

  return (
    <>
      {category.length === 0 ? (
        <div className="text-center">Kategoriyalar mavjud emas!</div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto grid grid-cols-1 gap-3 p-5">
            {category.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-500 rounded-lg px-5 py-3"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {item.createdAt}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-600 bg-blue-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white px-3 py-1 rounded-md"
                    onClick={() => showUpdateModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-600 bg-red-200 dark:bg-red-500 dark:hover:bg-red-600 dark:text-white px-3 py-1 rounded-md"
                    onClick={() => showDeleteModal(item)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Modal */}
      <Modal
        title="Update Category"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <Input
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Confirm Deletion"
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        okText="Yes, Delete"
        cancelText="No, Cancel"
      >
        <p>Are you sure you want to delete "{currentCategory?.name}"?</p>
      </Modal>
    </>
  );
};

export default BasicTableOne;