import React, { useState } from "react";
import { FaBookOpen, FaFantasyFlightGames, FaPenFancy } from "react-icons/fa"; // React Icons

interface BookItem {
  id: number;
  title: string;
  genre: string;
  description: string;
  author: string;
  status: "completed" | "pending" | "canceled";
  img: string; // Image URL
  icon: React.ReactNode;
  year: number; // Yil
}

const books: BookItem[] = [
  {
    id: 1,
    title: "Badiiy Adabiyot",
    genre: "Drama",
    description: "Badiiy adabiyot o'ziga xos dunyo yaratadi.",
    author: "Author 1",
    status: "completed",
    img: "https://via.placeholder.com/150",
    icon: <FaPenFancy size={30} />,
    year: 1998,
  },
  {
    id: 2,
    title: "Fantastika",
    genre: "Science Fiction",
    description: "Fantastika - ilmiy xayol va o'zgaruvchan dunyo.",
    author: "Author 2",
    status: "pending",
    img: "https://via.placeholder.com/150",
    icon: <FaFantasyFlightGames size={30} />,
    year: 2005,
  },
  {
    id: 3,
    title: "Tarixiy Kitoblar",
    genre: "History",
    description: "Tarixiy kitoblar o'tmish haqida hikoya qiladi.",
    author: "Author 3",
    status: "canceled",
    img: "https://via.placeholder.com/150",
    icon: <FaBookOpen size={30} />,
    year: 2010,
  },
];

const Book: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  const handleCardClick = (book: BookItem) => {
    setSelectedBook(book);
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="p-6">
      {/* Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              ✖
            </button>
            <div className="flex justify-center mb-4">
              <img
                src={selectedBook.img}
                alt={selectedBook.title}
                className="w-full max-w-xs rounded-xl object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedBook.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Muallif:</strong> {selectedBook.author}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Yil:</strong> {selectedBook.year}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Kitob janri:</strong> {selectedBook.genre}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Holat:</strong>{" "}
              <span
                className={`${
                  selectedBook.status === "completed"
                    ? "text-green-500"
                    : selectedBook.status === "pending"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {selectedBook.status}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Ta'rif:</strong> {selectedBook.description}
            </p>
          </div>
        </div>
      )}

      {/* Kitoblar ro'yxati */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 mt-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="cursor-pointer rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 hover:shadow-lg transition transform hover:scale-105"
            onClick={() => handleCardClick(book)}
          >
            <div className="flex justify-center mb-4">
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {book.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{book.genre}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{book.author}</p>
            <div
              className={`text-xs font-semibold mt-2 ${
                book.status === "completed"
                  ? "text-green-500"
                  : book.status === "pending"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {book.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Book;
