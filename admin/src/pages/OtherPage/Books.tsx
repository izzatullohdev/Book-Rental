import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import { FaBookOpen } from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  img: string;
  author: string;
  category: string;
  type: string; // kitob turi (Darslik, Badiiy, Yangi, PDF)
}

interface BookType {
  type: string;
  percentage: number;
  color: string;
}

const initialBooks: Book[] = [
  {
    id: 1,
    title: "Matematika 1-qism",
    img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
    author: "Olimjon Matyoqubov",
    category: "Matematika",
    type: "Darslik",
  },
  {
    id: 2,
    title: "Yulduzlar oralig'ida",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    author: "Isaac Asimov",
    category: "Fantastika",
    type: "Badiiy",
  },
  {
    id: 3,
    title: "Yangi texnologiyalar",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136",
    author: "Elon Musk",
    category: "Innovatsiya",
    type: "Yangi",
  },
  {
    id: 4,
    title: "Fizika PDF",
    img: "https://images.unsplash.com/photo-1532012197267-da84d127e765",
    author: "Richard Feynman",
    category: "Fizika",
    type: "PDF",
  },
];

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");

  const bookTypes = ["Darslik", "Badiiy", "Yangi", "PDF"];

  const typeStats: BookType[] = bookTypes.map((type) => {
    const total = books.length;
    const count = books.filter((book) => book.type === type).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    const color =
      type === "Darslik"
        ? "bg-blue-500"
        : type === "Badiiy"
        ? "bg-green-500"
        : type === "Yangi"
        ? "bg-yellow-500"
        : "bg-red-500";

    return { type, percentage, color };
  });

  const filteredBooks = books.filter((book) => {
    const matchesTitle = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? book.category === selectedCategory : true;
    return matchesTitle && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(books.map((book) => book.category)));

  const showEditModal = (book: Book) => {
    setSelectedBook(book);
    setEditedTitle(book.title);
    setEditedAuthor(book.author);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    if (selectedBook) {
      const updatedBooks = books.map((book) =>
        book.id === selectedBook.id ? { ...book, title: editedTitle, author: editedAuthor } : book
      );
      setBooks(updatedBooks);
      setIsEditModalVisible(false);
      setSelectedBook(null);
      message.success("Kitob muvaffaqiyatli tahrirlandi");
    }
  };

  const handleDeleteOk = () => {
    if (selectedBook) {
      const updatedBooks = books.filter((book) => book.id !== selectedBook.id);
      setBooks(updatedBooks);
      setIsDeleteModalVisible(false);
      setSelectedBook(null);
      message.success("Kitob muvaffaqiyatli o‘chirildi");
    }
  };

  return (
    <div className="p-6 space-y-10 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">📚 Kitoblar</h1>

      {/* Progress barlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {typeStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold dark:text-white">{stat.type}</h2>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {stat.percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded">
              <div
                className={`h-2 rounded ${stat.color}`}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 Filter: Search + Select */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <input
          type="text"
          placeholder="Kitob nomi bo‘yicha qidirish"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 h-10 px-4 rounded-md bg-white text-gray-800 border border-gray-300
                     dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/3 h-10 px-4 rounded-md bg-white text-gray-800 border border-gray-300
                     dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Barchasi</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Kitoblar ro‘yxati */}
      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Barcha kitoblar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col gap-3"
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-20 h-20 rounded-lg object-cover mx-auto"
              />
              <div className="flex items-center gap-3">
                <FaBookOpen className="text-blue-600 text-xl" />
                <div className="text-lg font-semibold dark:text-white">
                  {book.title}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Muallif: {book.author}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">{book.category}</div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => showEditModal(book)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  Tahrirlash
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setIsDeleteModalVisible(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  O‘chirish
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit modal */}
      <Modal
        title={<span className="dark:text-white">Kitobni tahrirlash</span>}
        open={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={() => setIsEditModalVisible(false)}
        okText="Saqlash"
        cancelText="Bekor qilish"
        className="dark:bg-gray-900 dark:text-white"
      >
        <div className="flex flex-col gap-3">
          <Input
            className="mb-3"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Kitob nomi"
          />
          <Input
            className="mb-3"
            value={editedAuthor}
            onChange={(e) => setEditedAuthor(e.target.value)}
            placeholder="Muallif"
          />
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal
        title={<span className="dark:text-white">O‘chirishni tasdiqlang</span>}
        open={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={() => setIsDeleteModalVisible(false)}
        okText="Ha, o‘chir"
        cancelText="Yo‘q, bekor"
        className="dark:bg-gray-900 dark:text-white"
      >
        <p className="dark:text-gray-300">
          “<b>{selectedBook?.title}</b>” nomli kitobni o‘chirmoqchimisiz?
        </p>
      </Modal>
    </div>
  );
};

export default Books;
