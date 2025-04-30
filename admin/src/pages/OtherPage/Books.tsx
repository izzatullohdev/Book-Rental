import React, { useState } from "react";
import { Modal, Input, message } from "antd";
import { FaBookOpen } from "react-icons/fa";

interface Book {
  id: number;
  title: string;
  img: string;
  author: string;
  category: string;
}

interface Category {
  title: string;
  percentage: number;
  color: string;
  books: Book[];
}

const initialCategories: Category[] = [
  {
    title: "Darslik adabiyot",
    percentage: 45,
    color: "bg-blue-500",
    books: [
      {
        id: 1,
        title: "Matematika 1",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "A. Karimov",
        category: "Darslik adabiyot",
      },
      {
        id: 2,
        title: "Fizika asoslari",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "Z. Rahimov",
        category: "Darslik adabiyot",
      },
    ],
  },
  {
    title: "Badiiy adabiyot",
    percentage: 30,
    color: "bg-green-500",
    books: [
      {
        id: 3,
        title: "Jinoyat va jazo",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "F. Dostoevskiy",
        category: "Badiiy adabiyot",
      },
      {
        id: 4,
        title: "Alkimyogar",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "P. Koelho",
        category: "Badiiy adabiyot",
      },
    ],
  },
  {
    title: "Yangi adabiyot",
    percentage: 15,
    color: "bg-yellow-500",
    books: [
      {
        id: 5,
        title: "Sun'iy intellekt",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "J. Smith",
        category: "Yangi adabiyot",
      },
    ],
  },
  {
    title: "PDF adabiyotlar",
    percentage: 10,
    color: "bg-red-500",
    books: [
      {
        id: 6,
        title: "Dasturlash asoslari",
        img: "https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png",
        author: "B. Rasulov",
        category: "PDF adabiyotlar",
      },
    ],
  },
];

const Books: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");

  const allBooks: Book[] = categories.flatMap((cat) => cat.books);

  const showEditModal = (book: Book) => {
    setSelectedBook(book);
    setEditedTitle(book.title);
    setEditedAuthor(book.author);
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    if (selectedBook) {
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        books: cat.books.map((book) =>
          book.id === selectedBook.id
            ? { ...book, title: editedTitle, author: editedAuthor }
            : book
        ),
      }));
      setCategories(updatedCategories);
      setIsEditModalVisible(false);
      setSelectedBook(null);
      message.success("Kitob muvaffaqiyatli tahrirlandi");
    }
  };

  const handleDeleteOk = () => {
    if (selectedBook) {
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        books: cat.books.filter((book) => book.id !== selectedBook.id),
      }));
      setCategories(updatedCategories);
      setIsDeleteModalVisible(false);
      setSelectedBook(null);
      message.success("Kitob muvaffaqiyatli o‘chirildi");
    }
  };

  return (
    <div className="p-6 space-y-10 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">📚 Kitoblar</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold dark:text-white">
                {category.title}
              </h2>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {category.percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded">
              <div
                className={`h-2 rounded ${category.color}`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Barcha kitoblar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBooks.map((book) => (
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
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Muallif: {book.author}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                {book.category}
              </div>
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
