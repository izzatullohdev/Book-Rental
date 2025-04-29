import React from "react";
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

const categories: Category[] = [
  {
    title: "Darslik adabiyot",
    percentage: 45,
    color: "bg-blue-500",
    books: [
      { id: 1, title: "Matematika 1", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "A. Karimov", category: "Darslik adabiyot" },
      { id: 2, title: "Fizika asoslari", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "Z. Rahimov", category: "Darslik adabiyot" },
    ],
  },
  {
    title: "Badiiy adabiyot",
    percentage: 30,
    color: "bg-green-500",
    books: [
      { id: 3, title: "Jinoyat va jazo", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "F. Dostoevskiy", category: "Badiiy adabiyot" },
      { id: 4, title: "Alkimyogar", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "P. Koelho", category: "Badiiy adabiyot" },
    ],
  },
  {
    title: "Yangi adabiyot",
    percentage: 15,
    color: "bg-yellow-500",
    books: [
      { id: 5, title: "Sun'iy intellekt", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "J. Smith", category: "Yangi adabiyot" },
    ],
  },
  {
    title: "PDF adabiyotlar",
    percentage: 10,
    color: "bg-red-500",
    books: [
      { id: 6, title: "Dasturlash asoslari", img:"https://w7.pngwing.com/pngs/776/145/png-transparent-books-illustration-book-book-rectangle-presentation-desktop-wallpaper-thumbnail.png", author: "B. Rasulov", category: "PDF adabiyotlar" },
    ],
  },
];

// Barcha kitoblarni bitta arrayga yig‘ish
const allBooks: Book[] = categories.flatMap((cat) => cat.books);

const Books: React.FC = () => {
  return (
    <div className="p-6 space-y-10">
      {/* Kategoriya statistikasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{category.title}</h2>
              <span className="text-sm font-medium text-gray-600">
                {category.percentage}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${category.color}`}
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pastda barcha kitoblar card ko'rinishida */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Barcha kitoblar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2"
            >
              <div className="flex-shrink-0">
                  <img
                    src={book.img}
                    alt={book.title}
                    className="w-16 h-16 rounded-lg"
                  />
                </div>
              <div className="flex items-center gap-3">
                
                <FaBookOpen className="text-blue-600 text-xl" />
                <div className="text-lg font-semibold">{book.title}</div>
              </div>
              <div className="text-sm text-gray-600">Muallif: {book.author}</div>
              <div className="text-xs text-gray-500 italic">{book.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;
